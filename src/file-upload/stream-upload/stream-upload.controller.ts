import { Controller, Post, Req, Res, Get, Param, BadRequestException, UseGuards } from '@nestjs/common';
import Busboy from 'busboy';
import * as path from 'path';
import { StreamUploadService } from './stream-upload.service';
import * as fs from 'fs';
import { getUploadDir } from '@shared/utils/upload-dir';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';


// @UseGuards(ApiKeyGuard)
@Controller('local')
@UseGuards(CompanyCheckGuard)
export class StreamUploadController {
    constructor(private readonly local: StreamUploadService) { }

    private readonly baseDir = getUploadDir(); // e.g., D:\uploads

    @Post('upload')
    async uploadLocal(@Req() req): Promise<any> {
        // Optional: pull these from req.company (your guard)
        const { organization_name, organization_id } = req.company ?? {};
        const dateDir = new Date().toISOString().split('T')[0];

        return await new Promise((resolve, reject) => {
            const busboy = Busboy({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024, files: 20 } });
            const fields: Record<string, string> = {};
            const jobs: Promise<any>[] = [];
            let org = organization_name || organization_id;


            busboy.on('field', (name, val) => {
                fields[name] = val;

                if (['organization', 'organizationId', 'companyId'].includes(name)) {
                    org = val;
                }
            });

            busboy.on('file', (_name, fileStream, info) => {
                const { filename } = info; // busboy v1+
                const safeOrg = (org)
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9_\-]/g, '');

                const subfolder =
                    (fields.subfolder || '').trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '')


                // prefer exposing baseDir from your service via a getter
                const targetDir = path.join(this.local['baseDir'], safeOrg, subfolder, dateDir);
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                jobs.push(this.local.saveStreamToLocal(fileStream, targetDir, filename));

            });



            busboy.on('error', (err: any) => {
                // NOTE: you had `error` variable typo earlier
                reject(new BadRequestException('Malformed form-data: ' + (err?.message || 'Unknown error')));
            });

            busboy.on('finish', async () => {
                try {
                    const uploaded = await Promise.all(jobs);
                    return resolve({
                        fields: {
                            name: fields.name || '',
                            phoneNumber: fields.phoneNumber || '',
                            email: fields.email || '',
                            organization: org,
                            subfolder: fields.subfolder || '',
                        },
                        uploaded,
                    });
                } catch (e: any) {
                    return reject(new BadRequestException(e.message));
                }
            });

            req.pipe(busboy);
        });
    }

    /** (Optional) GET /local/file/<date>/<org>/<filename> -> stream back */
    @Get('file/*path')
    async readLocal(@Param('path') rel: string, @Res() res) {
        console.log('>>>> rel (raw):', rel);

        if (!rel) throw new BadRequestException('Missing path');

        // 👇 convert comma-delimited string back to valid path
        rel = rel.replace(/,/g, '/');

        // Optional: strip "uploads/" prefix if client includes it
        if (rel.startsWith('uploads/')) rel = rel.slice(8);

        const abs = path.join(this.baseDir, rel);
        if (!fs.existsSync(abs)) throw new BadRequestException('File not found');
        fs.createReadStream(abs).pipe(res);
    }


    @Get(['list', 'list/*folderPath'])
    async listFiles(@Param('folderPath') folderPath?: string, @Req() req?: any) {
        const baseDir = getUploadDir();
        let { organization_name, organization_id } = req.company ?? {};
        let targetDir: string;
        if (folderPath) {
            targetDir = path.join(baseDir, folderPath.replace(/,/g, '/'));
        } else if (organization_name) {
            const safeOrg = organization_name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
            targetDir = path.join(baseDir, safeOrg);
        } else {
            targetDir = baseDir;
        }

        if (!fs.existsSync(targetDir)) {
            throw new BadRequestException(`Folder not found: ${folderPath || organization_name || 'root'}`);
        }

        try {
            const files: any[] = [];

            const walkDir = (dir: string) => {
                const items = fs.readdirSync(dir, { withFileTypes: true });
                for (const item of items) {
                    const fullPath = path.join(dir, item.name);
                    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                    const stats = fs.statSync(fullPath);

                    if (item.isDirectory()) walkDir(fullPath);
                    else
                        files.push({
                            name: item.name,
                            sizeMB: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
                            date: new Date(stats.mtime).toISOString().split('T')[0],
                            url: `/uploads/${relativePath}`,
                        });
                }
            };

            walkDir(targetDir);

            const totalFiles = files.length;
            const totalSizeMB = files
                .reduce((acc, f) => acc + parseFloat(f.sizeMB), 0)
                .toFixed(2);

            return {
                folder: targetDir || 'ALL',
                totalFiles,
                totalSize: `${totalSizeMB} MB`,
                files,
            };
        } catch (err) {
            throw new BadRequestException(`Failed to read uploads folder: ${err.message}`);
        }
    }


}



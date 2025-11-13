import * as path from 'path';

export function getUploadDir(): string {
    return path.resolve(process.cwd(), '../uploads'); // out of root-level  'uploads' folder
}
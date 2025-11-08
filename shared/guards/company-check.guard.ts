import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocEntity, DocEntityDocument } from '@shared/schema/organization_file_upload.schema'; 

@Injectable()
export class CompanyCheckGuard implements CanActivate {
  constructor(
    @InjectModel(DocEntity.name)
    private readonly docModel: Model<DocEntityDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.headers['companyid'] || request.headers['x-company-id'];

    if (!companyId) {
      throw new BadRequestException('Missing required header: companyId');
    }
    
    //  const conn = this.db.getConnection();
    // const coll = conn.collection('doc_service');
    // const company = await coll.findOne({ companyId });

    const exists = await this.docModel.findOne({organization_id :companyId });    

    if (!exists) {
      throw new ForbiddenException(`Permission denied: invalid companyId ${companyId}`);
    }
    request.company = exists || {};

    // ✅ if exists, allow controller to proceed
    return true;
  }
}

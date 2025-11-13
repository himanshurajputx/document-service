import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocEntityDocument = DocEntity & Document;

@Schema({ timestamps: true, collection: 'organization_file_upload' })
export class DocEntity {
  @Prop({ required: true, trim: true })
  organization_name: string;

  @Prop({ required: true, trim: true })
  organization_id: string;

  // @Prop({
  //   required: true,
  //   enum: ['pdf', 'png', 'jpg', 'jpeg'],
  //   lowercase: true,
  // })
  // fileType: 'pdf' | 'png' | 'jpg' | 'jpeg';
  fileType: string;

  @Prop({ required: true, min: 1, max: 50 * 1024 * 1024 }) // bytes
  fileSize: number;
 
}

export const DocEntitySchema = SchemaFactory.createForClass(DocEntity);

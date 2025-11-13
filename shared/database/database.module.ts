import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { DocEntity, DocEntitySchema } from '@shared/schema/organization_file_upload.schema';

// If you don't want envs, put your URI here:
const MONGO_URI =
    'mongodb+srv://RFOneDB:UQGeGRsvmbqo1nsL@app-setting.gtnic6l.mongodb.net/?retryWrites=true&w=majority&appName=app-setting';

// Optional: choose a db name; Atlas lets you select here:
const DB_NAME = 'document_service';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri: MONGO_URI,
                dbName: DB_NAME,
                // Recommended options
                serverSelectionTimeoutMS: 5000,
                heartbeatFrequencyMS: 10000,
                maxPoolSize: 10,
            }),
        }),
        MongooseModule.forFeature([{ name: DocEntity.name, schema: DocEntitySchema }]),

    ],
    providers: [DatabaseService],
    exports: [DatabaseService, MongooseModule],
})
export class DatabaseModule { }

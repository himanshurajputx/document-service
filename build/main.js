/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 11:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppLogger = void 0;
const common_1 = __webpack_require__(563);
const winston = __importStar(__webpack_require__(124));
const path = __importStar(__webpack_require__(928));
const fs = __importStar(__webpack_require__(896));
__webpack_require__(233);
let AppLogger = class AppLogger {
    logger;
    constructor() {
        const logDir = path.join(__dirname, '..', '..', '..', 'logs');
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: '%DATE%-app.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        });
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.File({
                    filename: path.join(logDir, 'error.log'),
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: path.join(logDir, 'combined.log'),
                }),
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                }),
            ],
        });
    }
    log(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, trace, meta) {
        this.logger.error(message, { trace, ...meta });
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
};
exports.AppLogger = AppLogger;
exports.AppLogger = AppLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppLogger);


/***/ }),

/***/ 16:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsBase64DataUrl = void 0;
const class_validator_1 = __webpack_require__(403);
let IsBase64DataUrl = class IsBase64DataUrl {
    validate(value, args) {
        if (typeof value !== 'string' || value.length === 0)
            return false;
        const [opts] = (args?.constraints || []);
        const allowRawBase64 = !!opts?.allowRawBase64;
        const maxBytes = opts?.maxBytes ?? 10 * 1024 * 1024;
        const allowedMimeTypes = opts?.allowedMimeTypes ?? [];
        const dataUrlMatch = value.match(/^data:([^;]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
        let mime;
        let b64;
        if (dataUrlMatch) {
            mime = dataUrlMatch[1];
            b64 = dataUrlMatch[2].replace(/\r?\n/g, '');
            if (allowedMimeTypes.length && !allowedMimeTypes.includes(mime))
                return false;
        }
        else {
            if (!allowRawBase64)
                return false;
            if (!/^[A-Za-z0-9+/=\r\n]+$/.test(value))
                return false;
            b64 = value.replace(/\r?\n/g, '');
        }
        const len = b64.length;
        const padding = (b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0);
        const approxBytes = Math.floor((len * 3) / 4) - padding;
        if (approxBytes <= 0 || approxBytes > maxBytes)
            return false;
        try {
            Buffer.from(b64, 'base64');
        }
        catch {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        const [opts] = (args?.constraints || []);
        const maxBytes = opts?.maxBytes ?? 10 * 1024 * 1024;
        const types = (opts?.allowedMimeTypes ?? []).join(', ') || 'valid mime types';
        return `fileContent must be a valid base64${opts?.allowRawBase64 ? ' or data URL' : ' data URL'} and <= ${Math.floor(maxBytes / (1024 * 1024))}MB${opts?.allowedMimeTypes?.length ? ` (${types})` : ''}`;
    }
};
exports.IsBase64DataUrl = IsBase64DataUrl;
exports.IsBase64DataUrl = IsBase64DataUrl = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsBase64DataUrl', async: false })
], IsBase64DataUrl);


/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 124:
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ 174:
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ 176:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(563);
const mongoose_1 = __webpack_require__(839);
const database_service_1 = __webpack_require__(329);
const organization_file_upload_schema_1 = __webpack_require__(428);
const MONGO_URI = 'mongodb+srv://RFOneDB:UQGeGRsvmbqo1nsL@app-setting.gtnic6l.mongodb.net/?retryWrites=true&w=majority&appName=app-setting';
const DB_NAME = 'document_service';
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async () => ({
                    uri: MONGO_URI,
                    dbName: DB_NAME,
                    serverSelectionTimeoutMS: 5000,
                    heartbeatFrequencyMS: 10000,
                    maxPoolSize: 10,
                }),
            }),
            mongoose_1.MongooseModule.forFeature([{ name: organization_file_upload_schema_1.DocEntity.name, schema: organization_file_upload_schema_1.DocEntitySchema }]),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService, mongoose_1.MongooseModule],
    })
], DatabaseModule);


/***/ }),

/***/ 202:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUploadDir = getUploadDir;
const path = __importStar(__webpack_require__(928));
function getUploadDir() {
    return path.resolve(process.cwd(), '../uploads');
}


/***/ }),

/***/ 205:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(563);
const file_upload_module_1 = __webpack_require__(589);
const health_module_1 = __webpack_require__(575);
const throttler_1 = __webpack_require__(752);
const core_1 = __webpack_require__(781);
const logger_module_1 = __webpack_require__(562);
const database_module_1 = __webpack_require__(176);
const company_check_guard_1 = __webpack_require__(779);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 10,
                    },
                ],
            }),
            logger_module_1.LoggerModule,
            database_module_1.DatabaseModule,
            file_upload_module_1.FileUploadModule,
            health_module_1.HealthModule
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            company_check_guard_1.CompanyCheckGuard
        ],
        exports: [company_check_guard_1.CompanyCheckGuard],
    })
], AppModule);


/***/ }),

/***/ 233:
/***/ ((module) => {

module.exports = require("winston-daily-rotate-file");

/***/ }),

/***/ 244:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadFilesDto = exports.SingleFileDto = void 0;
const class_validator_1 = __webpack_require__(403);
const class_validator_2 = __webpack_require__(403);
const base64_dataurl_validator_1 = __webpack_require__(16);
const class_transformer_1 = __webpack_require__(922);
class SingleFileDto {
    fileName;
    fileContent;
    subfolder;
}
exports.SingleFileDto = SingleFileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'fileName too long' }),
    (0, class_validator_2.Matches)(/^[a-zA-Z0-9_\-. ]+\.[a-zA-Z0-9]{1,10}$/, {
        message: 'fileName must include a safe extension (e.g., photo.png)',
    }),
    __metadata("design:type", String)
], SingleFileDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'fileContent is required' }),
    (0, class_validator_1.Validate)(base64_dataurl_validator_1.IsBase64DataUrl, [
        {
            allowRawBase64: true,
            maxBytes: 500 * 1024 * 1024,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
        },
    ]),
    __metadata("design:type", String)
], SingleFileDto.prototype, "fileContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_2.Matches)(/^[a-zA-Z0-9_\-\/]*$/, { message: 'subfolder has invalid characters' }),
    __metadata("design:type", String)
], SingleFileDto.prototype, "subfolder", void 0);
class UploadFilesDto {
    files;
}
exports.UploadFilesDto = UploadFilesDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'files must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one file is required' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SingleFileDto),
    __metadata("design:type", Array)
], UploadFilesDto.prototype, "files", void 0);


/***/ }),

/***/ 252:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 287:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFileSize = parseFileSize;
function parseFileSize(sizeStr) {
    const match = /^(\d+)(KB|MB|GB)?$/i.exec(sizeStr.trim());
    if (!match)
        return 0;
    const size = parseInt(match[1], 10);
    const unit = match[2]?.toUpperCase() || 'B';
    switch (unit) {
        case 'KB':
            return size * 1024;
        case 'MB':
            return size * 1024 * 1024;
        case 'GB':
            return size * 1024 * 1024 * 1024;
        default:
            return size;
    }
}


/***/ }),

/***/ 329:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(563);
const mongoose_1 = __webpack_require__(839);
const mongoose_2 = __webpack_require__(37);
let DatabaseService = DatabaseService_1 = class DatabaseService {
    connection;
    logger = new common_1.Logger(DatabaseService_1.name);
    constructor(connection) {
        this.connection = connection;
        this.connection.on('connected', () => {
            this.logger.log(`MongoDB connected to ${this.connection.name}`);
        });
        this.connection.on('disconnected', () => {
            this.logger.warn('MongoDB disconnected');
        });
        this.connection.on('error', (err) => {
            this.logger.error(`MongoDB error: ${err?.message || err}`);
        });
    }
    get readyState() {
        return this.connection.readyState;
    }
    isConnected() {
        return this.connection.readyState === 1;
    }
    async ping() {
        if (!this.connection.db) {
            throw new Error('Database connection is not established.');
        }
        const res = await this.connection.db.admin().ping();
        return { ok: !!res?.ok, db: this.connection.name };
    }
    async status() {
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        const { host } = this.connection.getClient().options || {};
        return {
            connected: this.isConnected(),
            state: states[this.readyState],
            dbName: this.connection.name,
            host,
        };
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], DatabaseService);


/***/ }),

/***/ 403:
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ 418:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(563);
const logger_service_1 = __webpack_require__(11);
let AllExceptionsFilter = class AllExceptionsFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.requestId;
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        this.logger.error('Unhandled Exception', exception instanceof Error ? exception.stack : '', {
            requestId,
            status,
            message,
            path: request.url,
        });
        response.status(status).json({
            requestId,
            success: false,
            statusCode: status,
            message,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.AppLogger])
], AllExceptionsFilter);


/***/ }),

/***/ 428:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocEntitySchema = exports.DocEntity = void 0;
const mongoose_1 = __webpack_require__(839);
let DocEntity = class DocEntity {
    organization_name;
    organization_id;
    fileType;
    fileSize;
};
exports.DocEntity = DocEntity;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], DocEntity.prototype, "organization_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], DocEntity.prototype, "organization_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 50 * 1024 * 1024 }),
    __metadata("design:type", Number)
], DocEntity.prototype, "fileSize", void 0);
exports.DocEntity = DocEntity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'organization_file_upload' })
], DocEntity);
exports.DocEntitySchema = mongoose_1.SchemaFactory.createForClass(DocEntity);


/***/ }),

/***/ 451:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(563);
const health_service_1 = __webpack_require__(856);
let HealthController = class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealth() {
        return await this.healthService.checkHealth();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);


/***/ }),

/***/ 525:
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ 562:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerModule = void 0;
const common_1 = __webpack_require__(563);
const logger_service_1 = __webpack_require__(11);
let LoggerModule = class LoggerModule {
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [logger_service_1.AppLogger],
        exports: [logger_service_1.AppLogger],
    })
], LoggerModule);


/***/ }),

/***/ 563:
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ 575:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(563);
const health_service_1 = __webpack_require__(856);
const health_controller_1 = __webpack_require__(451);
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        providers: [health_service_1.HealthService],
    })
], HealthModule);


/***/ }),

/***/ 589:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadModule = void 0;
const common_1 = __webpack_require__(563);
const file_upload_controller_1 = __webpack_require__(701);
const file_upload_service_1 = __webpack_require__(862);
const company_check_guard_1 = __webpack_require__(779);
const stream_upload_controller_1 = __webpack_require__(800);
const stream_upload_service_1 = __webpack_require__(789);
let FileUploadModule = class FileUploadModule {
};
exports.FileUploadModule = FileUploadModule;
exports.FileUploadModule = FileUploadModule = __decorate([
    (0, common_1.Module)({
        controllers: [file_upload_controller_1.FileUploadController, stream_upload_controller_1.StreamUploadController],
        providers: [file_upload_service_1.FileUploadService, company_check_guard_1.CompanyCheckGuard, stream_upload_service_1.StreamUploadService],
    })
], FileUploadModule);


/***/ }),

/***/ 603:
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ 624:
/***/ ((module) => {

module.exports = require("busboy");

/***/ }),

/***/ 701:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadController = void 0;
const common_1 = __webpack_require__(563);
const file_upload_service_1 = __webpack_require__(862);
const upload_file_dto_1 = __webpack_require__(244);
const company_check_guard_1 = __webpack_require__(779);
let FileUploadController = class FileUploadController {
    fileUploadService;
    constructor(fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    async uploadFile(dto, request) {
        const filePath = await this.fileUploadService.uploadBase64File(dto.files, request.company);
        return {
            message: 'File uploaded successfully',
            filePath,
        };
    }
};
exports.FileUploadController = FileUploadController;
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_dto_1.UploadFilesDto, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile", null);
exports.FileUploadController = FileUploadController = __decorate([
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)(company_check_guard_1.CompanyCheckGuard),
    __metadata("design:paramtypes", [file_upload_service_1.FileUploadService])
], FileUploadController);


/***/ }),

/***/ 752:
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ 779:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyCheckGuard = void 0;
const common_1 = __webpack_require__(563);
const mongoose_1 = __webpack_require__(839);
const mongoose_2 = __webpack_require__(37);
const organization_file_upload_schema_1 = __webpack_require__(428);
let CompanyCheckGuard = class CompanyCheckGuard {
    docModel;
    constructor(docModel) {
        this.docModel = docModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const companyId = request.headers['companyid'] || request.headers['x-company-id'];
        if (!companyId) {
            throw new common_1.BadRequestException('Missing required header: companyId');
        }
        const exists = await this.docModel.findOne({ organization_id: companyId });
        if (!exists) {
            throw new common_1.ForbiddenException(`Permission denied: invalid companyId ${companyId}`);
        }
        request.company = exists || {};
        return true;
    }
};
exports.CompanyCheckGuard = CompanyCheckGuard;
exports.CompanyCheckGuard = CompanyCheckGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_file_upload_schema_1.DocEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CompanyCheckGuard);


/***/ }),

/***/ 781:
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ 786:
/***/ ((module) => {

module.exports = require("stream/promises");

/***/ }),

/***/ 789:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StreamUploadService = void 0;
const common_1 = __webpack_require__(563);
const upload_dir_1 = __webpack_require__(202);
const fs = __importStar(__webpack_require__(896));
const fsp = __importStar(__webpack_require__(943));
const path = __importStar(__webpack_require__(928));
const promises_1 = __webpack_require__(786);
let StreamUploadService = class StreamUploadService {
    baseDir = (0, upload_dir_1.getUploadDir)();
    constructor() {
        if (!fs.existsSync(this.baseDir))
            fs.mkdirSync(this.baseDir, { recursive: true });
    }
    async saveStreamToLocal(fileStream, targetDir, originalName) {
        const ext = path.extname(originalName || '');
        const safeName = originalName
            ? path.basename(originalName).replace(/[^a-zA-Z0-9_.-]/g, '_')
            : `file_${Date.now()}${ext || ''}`;
        const fullPath = path.join(targetDir, safeName);
        await (0, promises_1.pipeline)(fileStream, fs.createWriteStream(fullPath));
        const stat = await fsp.stat(fullPath);
        const relativePath = path.relative(this.baseDir, fullPath).replace(/\\/g, '/');
        const publicUrl = `/uploads/${relativePath}`;
        return {
            fileName: safeName,
            size: (stat.size / 1024 / 1024).toFixed(2) + ' MB',
            url: publicUrl,
        };
    }
};
exports.StreamUploadService = StreamUploadService;
exports.StreamUploadService = StreamUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StreamUploadService);


/***/ }),

/***/ 800:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StreamUploadController = void 0;
const common_1 = __webpack_require__(563);
const busboy_1 = __importDefault(__webpack_require__(624));
const path = __importStar(__webpack_require__(928));
const stream_upload_service_1 = __webpack_require__(789);
const fs = __importStar(__webpack_require__(896));
const upload_dir_1 = __webpack_require__(202);
const company_check_guard_1 = __webpack_require__(779);
let StreamUploadController = class StreamUploadController {
    local;
    constructor(local) {
        this.local = local;
    }
    baseDir = (0, upload_dir_1.getUploadDir)();
    async uploadLocal(req) {
        const { organization_name, organization_id } = req.company ?? {};
        const dateDir = new Date().toISOString().split('T')[0];
        return await new Promise((resolve, reject) => {
            const busboy = (0, busboy_1.default)({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024, files: 20 } });
            const fields = {};
            const jobs = [];
            let org = organization_name || organization_id;
            busboy.on('field', (name, val) => {
                fields[name] = val;
                if (['organization', 'organizationId', 'companyId'].includes(name)) {
                    org = val;
                }
            });
            busboy.on('file', (_name, fileStream, info) => {
                const { filename } = info;
                const safeOrg = (org)
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9_\-]/g, '');
                const subfolder = (fields.subfolder || '').trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
                const targetDir = path.join(this.local['baseDir'], safeOrg, subfolder, dateDir);
                if (!fs.existsSync(targetDir))
                    fs.mkdirSync(targetDir, { recursive: true });
                jobs.push(this.local.saveStreamToLocal(fileStream, targetDir, filename));
            });
            busboy.on('error', (err) => {
                reject(new common_1.BadRequestException('Malformed form-data: ' + (err?.message || 'Unknown error')));
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
                }
                catch (e) {
                    return reject(new common_1.BadRequestException(e.message));
                }
            });
            req.pipe(busboy);
        });
    }
    async readLocal(rel, res) {
        console.log('>>>> rel (raw):', rel);
        if (!rel)
            throw new common_1.BadRequestException('Missing path');
        rel = rel.replace(/,/g, '/');
        if (rel.startsWith('uploads/'))
            rel = rel.slice(8);
        const abs = path.join(this.baseDir, rel);
        if (!fs.existsSync(abs))
            throw new common_1.BadRequestException('File not found');
        fs.createReadStream(abs).pipe(res);
    }
    async listFiles(folderPath, req) {
        const baseDir = (0, upload_dir_1.getUploadDir)();
        let { organization_name, organization_id } = req.company ?? {};
        let targetDir;
        if (folderPath) {
            targetDir = path.join(baseDir, folderPath.replace(/,/g, '/'));
        }
        else if (organization_name) {
            const safeOrg = organization_name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
            targetDir = path.join(baseDir, safeOrg);
        }
        else {
            targetDir = baseDir;
        }
        if (!fs.existsSync(targetDir)) {
            throw new common_1.BadRequestException(`Folder not found: ${folderPath || organization_name || 'root'}`);
        }
        try {
            const files = [];
            const walkDir = (dir) => {
                const items = fs.readdirSync(dir, { withFileTypes: true });
                for (const item of items) {
                    const fullPath = path.join(dir, item.name);
                    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                    const stats = fs.statSync(fullPath);
                    if (item.isDirectory())
                        walkDir(fullPath);
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
        }
        catch (err) {
            throw new common_1.BadRequestException(`Failed to read uploads folder: ${err.message}`);
        }
    }
};
exports.StreamUploadController = StreamUploadController;
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamUploadController.prototype, "uploadLocal", null);
__decorate([
    (0, common_1.Get)('file/*path'),
    __param(0, (0, common_1.Param)('path')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StreamUploadController.prototype, "readLocal", null);
__decorate([
    (0, common_1.Get)(['list', 'list/*folderPath']),
    __param(0, (0, common_1.Param)('folderPath')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StreamUploadController.prototype, "listFiles", null);
exports.StreamUploadController = StreamUploadController = __decorate([
    (0, common_1.Controller)('local'),
    (0, common_1.UseGuards)(company_check_guard_1.CompanyCheckGuard),
    __metadata("design:paramtypes", [stream_upload_service_1.StreamUploadService])
], StreamUploadController);


/***/ }),

/***/ 820:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiKeyGuard = void 0;
const common_1 = __webpack_require__(563);
let ApiKeyGuard = class ApiKeyGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-company-id'];
        if (apiKey !== 'x-company-id') {
            throw new common_1.UnauthorizedException('Invalid or missing API key');
        }
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)()
], ApiKeyGuard);


/***/ }),

/***/ 832:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(563);
const operators_1 = __webpack_require__(603);
const uuid_1 = __webpack_require__(903);
const logger_service_1 = __webpack_require__(11);
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const requestId = (0, uuid_1.v4)();
        request.requestId = requestId;
        const { method, url, body, query, params } = request;
        const start = Date.now();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const duration = Date.now() - start;
            const logData = {
                requestId,
                method,
                url,
                status: response.statusCode,
                duration: `${duration}ms`,
            };
            return {
                requestId,
                success: true,
                data,
            };
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - start;
            this.logger.error('Request Failed', error.stack, {
                requestId,
                method,
                url,
                status: response.statusCode,
                duration: `${duration}ms`,
            });
            throw error;
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLogger])
], LoggingInterceptor);


/***/ }),

/***/ 839:
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ 856:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthService = void 0;
const common_1 = __webpack_require__(563);
const database_service_1 = __webpack_require__(329);
const fs = __importStar(__webpack_require__(896));
const path = __importStar(__webpack_require__(928));
let HealthService = class HealthService {
    db;
    constructor(db) {
        this.db = db;
    }
    uploadDir = path.join(__dirname, '..', '..', 'uploads');
    async checkHealth() {
        const uploadExists = fs.existsSync(this.uploadDir);
        const status = await this.db.status();
        let pingOk = false;
        try {
            const res = await this.db.ping();
            pingOk = res.ok;
        }
        catch {
            pingOk = false;
        }
        let writable = false;
        try {
            fs.accessSync(this.uploadDir, fs.constants.W_OK);
            writable = true;
        }
        catch {
            writable = false;
        }
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'File Upload Service',
            dataBase: {
                ...status,
                ping: pingOk,
            },
            uploadDirectory: {
                exists: uploadExists,
                writable,
                path: this.uploadDir,
            },
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], HealthService);


/***/ }),

/***/ 862:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadService = void 0;
const common_1 = __webpack_require__(563);
const file_size_util_1 = __webpack_require__(287);
const upload_dir_1 = __webpack_require__(202);
const fs = __importStar(__webpack_require__(896));
const path = __importStar(__webpack_require__(928));
const uuid_1 = __webpack_require__(903);
let FileUploadService = class FileUploadService {
    baseUploadDir;
    constructor() {
        this.baseUploadDir = (0, upload_dir_1.getUploadDir)();
        if (!fs.existsSync(this.baseUploadDir)) {
            fs.mkdirSync(this.baseUploadDir, { recursive: true });
            console.log('📁 Created base upload directory:', this.baseUploadDir);
        }
    }
    async uploadBase64File(files, organization) {
        try {
            if (!Array.isArray(files) || files.length === 0)
                throw new common_1.BadRequestException('No files provided');
            let uploaded = [];
            const orgName = organization?.organization_name;
            const orgId = organization?.organization_id;
            for (const file of files) {
                const maxBytes = (0, file_size_util_1.parseFileSize)(organization?.file_size || '500MB');
                const allowedTypes = organization?.file_type || [];
                let subfolder = file?.subfolder || orgName || orgId || 'default';
                const matches = file.fileContent.match(/^data:(.+);base64,(.+)$/);
                const fileBuffer = Buffer.from(matches ? matches[2] : file.fileContent, 'base64');
                const mime = matches ? matches[1] : '';
                let ext = '';
                if (file?.fileName) {
                    ext = path.extname(file?.fileName).toLowerCase();
                }
                else if (mime) {
                    const subtype = mime.split('/')[1];
                    ext = subtype ? '.' + subtype.toLowerCase() : '';
                }
                if (allowedTypes.length && !allowedTypes.includes(ext)) {
                    throw new common_1.BadRequestException(`File type "${ext}" not allowed`);
                }
                const fileSize = fileBuffer.length;
                if (fileSize > maxBytes) {
                    throw new common_1.BadRequestException(`File size exceeds limit. Max: ${organization?.file_size}, Received: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
                }
                const folderName = new Date().toISOString().split('T')[0];
                let targetDir;
                if (subfolder) {
                    const safeSub = subfolder.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/^\/*|\/*$/g, '');
                    targetDir = path.join(this.baseUploadDir, safeSub, folderName);
                }
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                let safeFileName;
                if (file?.fileName) {
                    const base = path.basename(file.fileName).replace(/[^a-zA-Z0-9_.-]/g, '_');
                    safeFileName = base.length > 3 ? base : `${(0, uuid_1.v4)()}${ext}`;
                }
                else {
                    safeFileName = `${(0, uuid_1.v4)()}${ext || '.bin'}`;
                }
                const filePath = path.join(targetDir, safeFileName);
                fs.writeFileSync(filePath, fileBuffer);
                const relativePath = `/uploads/${subfolder ? '/' + subfolder : ''}/${safeFileName}`;
                uploaded.push({
                    fileName: safeFileName,
                    url: relativePath.replace(/\\/g, '/'),
                });
            }
            return { uploaded };
        }
        catch (err) {
            throw new common_1.BadRequestException('File upload failed: ' + err.message);
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 903:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 922:
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ 927:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(781);
const app_module_1 = __webpack_require__(205);
const helmet_1 = __importDefault(__webpack_require__(525));
const compression_1 = __importDefault(__webpack_require__(174));
const common_1 = __webpack_require__(563);
const logging_interceptor_1 = __webpack_require__(832);
const all_exceptions_filter_1 = __webpack_require__(418);
const logger_service_1 = __webpack_require__(11);
const express = __importStar(__webpack_require__(252));
const express_1 = __webpack_require__(252);
const shared_1 = __webpack_require__(975);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST', 'DELETE', 'PATCH'],
            credentials: true,
        },
    });
    const logger = app.get(logger_service_1.AppLogger);
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ limit: '50mb', extended: true }));
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(logger));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(logger));
    app.enableShutdownHooks();
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });
    const uploadsPath = (0, shared_1.getUploadDir)();
    app.use('/uploads', express.static(uploadsPath));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`✅ Server running securely on http://localhost:${port}`);
}
bootstrap();


/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 943:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 975:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(820), exports);
__exportStar(__webpack_require__(779), exports);
__exportStar(__webpack_require__(202), exports);
__exportStar(__webpack_require__(287), exports);
__exportStar(__webpack_require__(418), exports);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(927);
/******/ 	
/******/ })()
;
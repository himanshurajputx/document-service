import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AppLogger } from "../logger/logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const requestId = (request as any).requestId;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    this.logger.error(
      "Unhandled Exception",
      exception instanceof Error ? exception.stack : "",
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        requestId,
        status,
        message,
        path: request.url,
      },
    );

    response.status(status).json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId,
      success: false,
      statusCode: status,
      message,
    });
  }
}

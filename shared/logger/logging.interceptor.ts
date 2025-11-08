import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { AppLogger } from "./logger.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = httpContext.getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = httpContext.getResponse();

    const requestId = uuidv4();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.requestId = requestId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, body, query, params } = request;
    const start = Date.now();

    this.logger.log("Incoming Request", {
      requestId,
      method,
      url,
      body,
      query,
      params,
    });

    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - start;
        const logData = {
          requestId,
          method,
          url,
          status: response.statusCode,
          duration: `${duration}ms`,
        };

        this.logger.log("Response Sent", logData);

        return {
          requestId,
          success: true,
          data,
        };
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        this.logger.error("Request Failed", error.stack, {
          requestId,
          method,
          url,
          status: response.statusCode,
          duration: `${duration}ms`,
        });
        throw error;
      }),
    );
  }
}

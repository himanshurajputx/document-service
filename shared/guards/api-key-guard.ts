import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-company-id'];
    if (apiKey !== 'x-company-id') {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}

import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwt(request);
    if(!token)
      throw new HttpException('Forbidden',403)
    request['user'] = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return true;
  }

  private extractJwt(request: Request): string {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return token ? token : undefined;
  }
}

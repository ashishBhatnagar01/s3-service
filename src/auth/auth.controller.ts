import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, SignUpDTO } from './dto/auth.dto';
import { BaseController } from '../../core/base.controller';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }
  @Post('signup')
  async signup(@Body() body: SignUpDTO): Promise<any> {
    return this.standardResponse(await this.authService.createUser(body));
  }

  @Post('login')
  async login(@Body() body: LoginDTO): Promise<any> {
    return this.standardResponse(await this.authService.login(body));
  }
}

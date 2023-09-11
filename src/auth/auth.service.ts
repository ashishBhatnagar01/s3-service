import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/service/prisma.service';
import { LoginDTO, SignUpDTO } from './dto/auth.dto';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { ErrorMessages } from '../../utils/messages/error.messages';
import e from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private errorMessages: ErrorMessages,
  ) {}

  async createUser(body: SignUpDTO): Promise<string> {
    body.password = await bcrypt.hashPassword(body.password, 10);
    const user = await this.prisma.users.create({
      data: body,
    });
    delete user.password;
    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  async login(body: LoginDTO): Promise<string> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: body.email,
      },
    });
    const doesPasswordMatch = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!doesPasswordMatch)
      throw new HttpException(this.errorMessages.INCORRECT_PASSWORD, 400);

    delete user.password;
    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });
    return token;
  }
}

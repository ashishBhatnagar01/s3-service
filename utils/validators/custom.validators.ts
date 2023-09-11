import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/service/prisma.service';
import { ErrorMessages } from '../messages/error.messages';
const prisma = new PrismaService();
const errorMessages = new ErrorMessages();

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const doesValueExist = await prisma.users.findFirst({
      where: {
        email: value,
      },
    });
    if (doesValueExist) return false;
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return errorMessages.EMAIL_ALREADY_EXIST;
  }
}

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExist implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const doesValueExist = await prisma.users.findFirst({
      where: {
        email: value,
      },
    });
    if (doesValueExist) return true;
    return false;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return errorMessages.EMAIL_NOT_REGISTERED;
  }
}

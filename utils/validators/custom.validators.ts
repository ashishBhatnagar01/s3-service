import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/service/prisma.service';
import * as fs from 'fs';
import { CustomMessages } from '../messages/custom.messages';
import * as path from 'path';
import * as process from 'process';
const prisma = new PrismaService();
const errorMessages = new CustomMessages();

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

@ValidatorConstraint({ name: 'IsUniqueBucketName', async: true })
@Injectable()
export class IsUniqueBucketName implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const bucketList = fs.readdirSync(path.join(process.cwd(), 'buckets'));
    return !bucketList.includes(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return errorMessages.BUCKET_NOT_AVAILABLE;
  }
}

@ValidatorConstraint({ name: 'DoesBucketExist', async: true })
@Injectable()
export class DoesBucketExist implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): any {
    return fs.existsSync(path.join(process.cwd(), 'buckets', value));
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return errorMessages.BUCKET_NOT_FOUND;
  }
}

@ValidatorConstraint({ name: 'IsValidKey', async: true })
@Injectable()
export class IsValidKey implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const validateKey = await prisma.files.findFirst({
      where: {
        key: value,
      },
    });
    if(validateKey)
      return true;
    return false;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return errorMessages.INVALID_KEY;
  }
}

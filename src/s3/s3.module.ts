import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { PrismaService } from "../../core/service/prisma.service";
import { CustomMessages } from "../../utils/messages/custom.messages";

@Module({
  providers: [S3Service, PrismaService,CustomMessages],
  controllers: [S3Controller]
})
export class S3Module {}

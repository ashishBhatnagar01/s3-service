import { HttpException, Injectable, Query } from '@nestjs/common';
import { PrismaService } from '../../core/service/prisma.service';
import {
  CreateBucketDTO,
  DeleteObjectDTO,
  GetObjectDTO,
  ListObjectDTO,
  PutObjectDTO,
} from './dto/s3.dto';
import { User } from '../../utils/decorators/custom.decorator';
import { UserInterface } from '../../utils/interfaces/interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { CustomMessages } from '../../utils/messages/custom.messages';

@Injectable()
export class S3Service {
  constructor(
    private readonly prisma: PrismaService,
    private customMessages: CustomMessages,
  ) {}
  async createBucket(
    data: CreateBucketDTO,
    @User() user: UserInterface,
  ): Promise<{ status: boolean }> {

    fs.mkdir(path.join(process.cwd(), 'buckets', data.bucket_name), (err) => {
      if (err) throw new HttpException(err.message, 400);
    });
    await this.prisma.buckets.create({
      data: {
        bucket_name: data.bucket_name,
        user_id: user.id,
      },
    });
    return {
      status: true,
    };
  }

  async listBuckets(@User() user: UserInterface): Promise<any> {
    const buckets = await this.prisma.buckets.findMany({
      where: {
        user_id: user.id,
      },
    });
    return {
      buckets: buckets.map((item) => {
        return item.bucket_name;
      }),
    };
  }

  async putObject(
    @User() user: UserInterface,
    file: Express.Multer.File,
    body: PutObjectDTO,
  ): Promise<any> {
    const bucket = await this.prisma.buckets.findFirst({
      where: {
        bucket_name: body.bucket_name,
        user_id: user.id,
      },
    });
    if (!bucket) throw new HttpException(this.customMessages.NOT_ALLOWED, 400);
    const key = Date.now();
    file.originalname = `${key + '_' + file.originalname}`;
    const stream = fs.createWriteStream(
      path.join(process.cwd(), 'buckets', body.bucket_name, file.originalname),
    );
    stream.write(file.buffer);
    await this.prisma.files.create({
      data: {
        file_name: file.originalname,
        key: String(key),
        mime_type: file.mimetype,
        file_size: file.size,
        user_id: user.id,
        bucket_id: bucket.id,
      },
    });
    return {
      key: key,
      file_name: file.originalname,
      bucket_id: bucket.id,
    };
  }

  async getObject(user: UserInterface, query: GetObjectDTO): Promise<any> {
    const file = await this.prisma.files.findFirst({
      where: {
        key: query.key,
        bucket: {
          bucket_name: query.bucket_name,
        },
      },
      select: {
        file_name: true,
        mime_type: true,
      },
    });
    if (!file) throw new HttpException(this.customMessages.FILE_NOT_FOUND, 400);
    const fileBuffer = fs.readFileSync(
      path.join(process.cwd(), 'buckets', query.bucket_name, file.file_name),
    );
    return {
      buffer: fileBuffer,
      mime_type: file.mime_type,
    };
  }

  async listObject(
    @User() user: UserInterface,
    @Query() data: ListObjectDTO,
  ): Promise<{ id: string; key: string; file_name: string }[]> {
    const getBucket = await this.prisma.buckets.findFirst({
      where: {
        bucket_name: data.bucket_name,
        user_id: user.id,
      },
      include: {
        files: true,
      },
    });
    if (!getBucket)
      throw new HttpException(this.customMessages.NOT_ALLOWED, 400);
    const list = getBucket.files.map((item) => {
      return {
        id: item.id,
        key: item.key,
        file_name: item.file_name,
      };
    });
    return list;
  }

  async deleteObject(user: UserInterface, data: DeleteObjectDTO): Promise<any> {
    const bucket = await this.prisma.buckets.findFirst({
      where: {
        user_id: user.id,
        bucket_name: data.bucket_name,
      },
      include: {
        files: {
          where: {
            key: data.key,
          },
        },
      },
    });
    const file_name = bucket.files[0].file_name;
    fs.rmSync(path.join(process.cwd(), 'buckets', data.bucket_name, file_name));
    await this.prisma.files.delete({
      where: {
        id: bucket.files[0].id,
      },
    });
    return true;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { AuthGuard } from '../../utils/guards/auth.guard';
import {
  CreateBucketDTO,
  DeleteObjectDTO,
  GetObjectDTO,
  ListObjectDTO,
  PutObjectDTO,
} from './dto/s3.dto';
import { User } from '../../utils/decorators/custom.decorator';
import { UserInterface } from '../../utils/interfaces/interfaces';
import { BaseController } from '../../core/base.controller';
import { CustomMessages } from '../../utils/messages/custom.messages';
import { FileInterceptor } from '@nestjs/platform-express';
import { BodyInterceptor } from '../../utils/interceptors/custom.interceptors';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('s3')
export class S3Controller extends BaseController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly customMessage: CustomMessages,
  ) {
    super();
  }
  @Post('create-bucket')
  async createBucket(
    @Body() body: CreateBucketDTO,
    @User() user: UserInterface,
  ): Promise<any> {
    return this.standardResponse(
      await this.s3Service.createBucket(body, user),
      this.customMessage.BUCKET_CREATED_SUCCESSFULLY,
      201,
    );
  }

  @Get('list-buckets')
  async getBuckets(@User() user: UserInterface): Promise<any> {
    return this.standardResponse(
      await this.s3Service.listBuckets(user),
      this.customMessage.SUCCESS,
    );
  }

  @Post('put-object')
  @UseInterceptors(FileInterceptor('file'))
  async putObject(
    @User() user: UserInterface,
    @Body() body: PutObjectDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.standardResponse(
      await this.s3Service.putObject(user, file, body),
      this.customMessage.SUCCESS,
      201,
    );
  }

  @Get('get-object')
  async getObject(
    @User() user: UserInterface,
    @Query() data: GetObjectDTO,
    @Res() res: Response,
  ): Promise<any> {
    const { buffer, mime_type } = await this.s3Service.getObject(user, data);
    res.set('content-type', mime_type);
    res.set('content-disposition', 'attachment');
    res.send(buffer);
  }

  @Get('list-objects')
  async listObjects(
    @User() user: UserInterface,
    @Query() data: ListObjectDTO,
  ): Promise<any> {
    return this.standardResponse(await this.s3Service.listObject(user, data));
  }

  @Delete('delete-object')
  async deleteObject(
    @User() user: UserInterface,
    @Query() data: DeleteObjectDTO,
  ): Promise<any> {
    return this.standardResponse(await this.s3Service.deleteObject(user, data));
  }
}

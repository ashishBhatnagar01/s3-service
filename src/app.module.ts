import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [S3Module, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

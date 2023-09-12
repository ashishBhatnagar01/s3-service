import { IsNotEmpty, Validate } from "@nestjs/class-validator";
import { DoesBucketExist, IsUniqueBucketName, IsValidKey } from "../../../utils/validators/custom.validators";

export class CreateBucketDTO {
  @IsNotEmpty()
  @Validate(IsUniqueBucketName)
  bucket_name: string;
}

export class PutObjectDTO {
  @IsNotEmpty()
  @Validate(DoesBucketExist)
  bucket_name: string;
}

export class GetObjectDTO {
  @IsNotEmpty()
  @Validate(DoesBucketExist)
  bucket_name: string;
  @IsNotEmpty()
  @Validate(IsValidKey)
  key: string;
}

export class ListObjectDTO {
  @IsNotEmpty()
  @Validate(DoesBucketExist)
  bucket_name: string;
}

export class DeleteObjectDTO {
  @IsNotEmpty()
  @Validate(DoesBucketExist)
  bucket_name: string;
  @IsNotEmpty()
  @Validate(IsValidKey)
  key: string;
}
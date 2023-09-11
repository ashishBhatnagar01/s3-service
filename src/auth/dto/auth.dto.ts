import { IsEmail, IsNotEmpty, Validate } from "@nestjs/class-validator";
import { IsExist, IsUnique } from "../../../utils/validators/custom.validators";

export class SignUpDTO {
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUnique)
  email: string;
  @IsNotEmpty()
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsExist)
  email: string;
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Name',
    nullable: false,
    required: true,
    type: 'string',
    example: 'John Sample',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Email',
    uniqueItems: true,
    nullable: false,
    required: true,
    type: 'string',
    example: 'youremail@example.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password: Min 6 characters, 1 uppercase, 1 lowercase and 1 number',
    nullable: false,
    required: true,
    type: 'string',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase, one lowercase and one number',
  })
  @NotContains(' ', { message: 'El password no debe contener espacios' })
  password: string;

  @ApiProperty({
    description: 'User Avatar Image',
    nullable: true,
    required: false,
    type: 'string',
    example: 'https://picsum.photos/200/300',
  })
  @IsString()
  @IsOptional()
  image: string;
}

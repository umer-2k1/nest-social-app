import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

enum MediaType {
  image = 'image',
  video = 'video',
  audio = 'audio',
}

class MediaDto {
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @IsEnum(MediaType)
  type: MediaType;
}

export class CreateTweetDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  @IsOptional()
  media?: MediaDto[];
}

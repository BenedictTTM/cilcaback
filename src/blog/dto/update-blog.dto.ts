import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { BlogPostStatus } from '@prisma/client';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;
}

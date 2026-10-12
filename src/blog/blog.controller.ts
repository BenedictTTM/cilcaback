import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /** GET /blog — paginated list of published posts */
  @Get()
  getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.blogService.getPublishedPosts(page, Math.min(limit, 50));
  }

  /** POST /blog — create a new post */
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Body() dto: CreateBlogDto, 
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|webp|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    ) file?: Express.Multer.File
  ) {
    return this.blogService.createPost(dto, req.user.id, file);
  }

  /** PUT /blog/:id — update a post (author or admin only) */
  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: UpdateBlogDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|webp|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    ) file?: Express.Multer.File
  ) {
    return this.blogService.updatePost(postId, dto, req.user.id, req.user.role, file);
  }

  /** DELETE /blog/:id — delete a post (author or admin only) */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id', ParseIntPipe) postId: number, @Request() req) {
    return this.blogService.deletePost(postId, req.user.id, req.user.role);
  }

  /** POST /blog/:id/like — toggle like on a post */
  @Post(':id/like')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  toggleLike(@Param('id', ParseIntPipe) postId: number, @Request() req) {
    return this.blogService.toggleLike(postId, req.user.id);
  }
}

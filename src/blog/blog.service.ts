import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogPostStatus } from '@prisma/client';

const AUTHOR_SELECT = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  profilePic: true,
};

const POST_INCLUDE = {
  author: { select: AUTHOR_SELECT },
  _count: { select: { comments: true } },
};

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async uniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let attempt = 0;

    while (true) {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }
  }

  private assertOwnerOrAdmin(resourceAuthorId: number, userId: number, userRole: string) {
    if (resourceAuthorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
  }

  async createPost(dto: CreateBlogDto, authorId: number, file?: Express.Multer.File) {
    const baseSlug = this.generateSlug(dto.title);
    const slug = await this.uniqueSlug(baseSlug);

    const publishedAt = dto.status === BlogPostStatus.PUBLISHED ? new Date() : null;

    let coverImage = dto.coverImage ?? null;
    
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        coverImage = uploadResult.secure_url;
      } catch (err) {
        throw new BadRequestException('Image upload failed.');
      }
    }

    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        excerpt: dto.excerpt ?? null,
        coverImage,
        category: dto.category,
        tags: dto.tags ?? [],
        status: dto.status ?? BlogPostStatus.DRAFT,
        featured: dto.featured ?? false,
        authorId,
        publishedAt,
      },
      include: POST_INCLUDE,
    });
  }

  async getPublishedPosts(page: number, limit: number) {
    const where: any = { status: BlogPostStatus.PUBLISHED };
    const skip = (page - 1) * limit;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: POST_INCLUDE,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async updatePost(postId: number, dto: UpdateBlogDto, userId: number, userRole: string, file?: Express.Multer.File) {
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Blog post not found');

    this.assertOwnerOrAdmin(post.authorId, userId, userRole);

    let slug = post.slug;
    if (dto.title && dto.title !== post.title) {
      const baseSlug = this.generateSlug(dto.title);
      slug = await this.uniqueSlug(baseSlug, postId);
    }

    const publishedAt =
      dto.status === BlogPostStatus.PUBLISHED && post.status !== BlogPostStatus.PUBLISHED
        ? new Date()
        : post.publishedAt;

    let coverImage = post.coverImage;
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        coverImage = uploadResult.secure_url;
      } catch (err) {
        throw new BadRequestException('Image upload failed.');
      }
    } else if (dto.coverImage !== undefined) {
      coverImage = dto.coverImage;
    }

    return this.prisma.blogPost.update({
      where: { id: postId },
      data: {
        ...(dto as any),
        coverImage,
        slug,
        publishedAt,
        tags: dto.tags ?? post.tags,
      },
      include: POST_INCLUDE,
    });
  }

  async toggleLike(postId: number, userId: number) {
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Blog post not found');
    if (post.status !== BlogPostStatus.PUBLISHED) throw new NotFoundException('Blog post not found');

    const alreadyLiked = post.likedBy.includes(userId);
    const updatedLikedBy = alreadyLiked
      ? post.likedBy.filter((id) => id !== userId)
      : [...post.likedBy, userId];

    const updated = await this.prisma.blogPost.update({
      where: { id: postId },
      data: { likedBy: updatedLikedBy },
      select: { id: true, likedBy: true },
    });

    return {
      liked: !alreadyLiked,
      totalLikes: updated.likedBy.length,
    };
  }

  async deletePost(postId: number, userId: number, userRole: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Blog post not found');
    this.assertOwnerOrAdmin(post.authorId, userId, userRole);

    await this.prisma.blogPost.delete({ where: { id: postId } });
    return { message: 'Blog post deleted successfully' };
  }
}

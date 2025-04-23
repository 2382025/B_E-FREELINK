import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  async save(user: Posts): Promise<Posts> {
    return this.postsRepository.save(user);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Posts[]> {
    return await this.postsRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndPostId(userId: number, postId: number): Promise<Posts> {
    const post = await this.postsRepository.findOne({
      where: {
        user_id: userId,
        id: postId,
      },
    });
    if (!post) {
      return new Posts();
    }
    return post;
  }

  async deleteById(postId: number) {
    await this.postsRepository.delete({ id: postId });
  }
}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { PostController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
    imports: [TypeOrmModule.forFeature([Posts])],
    controllers: [PostController],
    providers: [PostsService]
})
export class PostsModule {}
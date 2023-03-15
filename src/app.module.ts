import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
    CommentModule,
    FavoriteModule,
    LikeModule,
  ],
})
class AppModule {}

export default AppModule;

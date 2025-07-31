import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FollowsModule } from './tweets/follows/follows.module';
import { FollowsModule } from './follows/follows.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TweetsModule } from './tweets/tweets.module';
import { MediaModule } from './media/media.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FollowsModule,
    CommentsModule,
    LikesModule,
    MediaModule,
    TweetsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

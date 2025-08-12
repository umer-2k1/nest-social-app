import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}

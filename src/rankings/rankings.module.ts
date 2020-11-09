import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { RankingSchema } from './interfaces/rankings.schema';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  controllers: [RankingsController],
  providers: [RankingsService],
  imports: [
    MongooseModule.forFeature([{
      name: 'Rankings',
      schema: RankingSchema
    }]),
    ClientProxyModule
  ]
})
export class RankingsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    RankingsModule,
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.zkh1s.mongodb.net/srranking?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  ]
})
export class AppModule {}

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as momentTimezone from 'moment-timezone';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:KMiBwRe8dlKg@52.91.4.62:5672/smartranking'],
      queue: 'rankings',
      noAck: false
    }
  });
  await app.listen(() => logger.log('Microservice is listening'));
}


Date.prototype.toJSON = function(): any {
  return momentTimezone(this)
    .tz('America/Sao_Paulo')
    .format('YYYY-MM-DD HH:mm:ss.SSS')
}

bootstrap();

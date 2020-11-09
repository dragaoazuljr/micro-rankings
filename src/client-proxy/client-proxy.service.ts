import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {

  constructor(
    private readonly _configService: ConfigService
  ){ }

  createProxyFactoryDesafios(){
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get('RABBITMQ_URL')],
        queue: 'admin-desafios'
      }
    })
  }

  createProxyFactoryAdmin(){
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get('RABBITMQ_URL')],
        queue: 'admin-backend'
      }
    })
  }

  createProxyFactoryRankings(){
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get('RABBITMQ_URL')],
        queue: 'rankings'
      }
    })
  }
}

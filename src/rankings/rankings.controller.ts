import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Partida } from './interfaces/partida.interface';
import { RankingsService } from './rankings.service';

@Controller()
export class RankingsController {

    private logger = new Logger(RankingsController.name);
    private ackErrors = ['E11000'];

    constructor(
        private readonly _rankingService: RankingsService
    ) {}

    @EventPattern('processar-partida')
    async processarPartida(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        try{
            await this._rankingService.processarPartida(data.partida._id, data.partida);
            await channel.ack(message);
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            this.validateErrorMessageToClearQueue(error, channel, message);
        }
    }

    @MessagePattern('consultar-rankings')
    async consultarRankings(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try {
            return await this._rankingService.consultarRankings(data.idCategoria, data.dataRef)
        } finally {
            channel.ack(message);
        }
    }

    @MessagePattern('consultar-ranking-jogador')
    async consultarRankingsJogador(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try {
            return await this._rankingService.consultarRankingPorJogador(data.idJogador);
        } finally {
            channel.ack(message);
        }
    }

    validateErrorMessageToClearQueue(error: any, channel, message) {
        this.ackErrors.map(async err => {
            if(error.message.includes(err)){
                await channel.ack(message);
            }
        })
    }
}

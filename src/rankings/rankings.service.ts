import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { Categoria, EventoEnum } from './interfaces/categoria.interface';
import { Partida } from './interfaces/partida.interface';
import { Ranking } from './interfaces/rankings.schema';

@Injectable()
export class RankingsService {

    private logger = new Logger(RankingsService.name);
    private _clientAdmin = this._clientProxy.createProxyFactoryAdmin();


    constructor (
        @InjectModel('Rankings') private readonly _rankingModel: Model<Ranking>,
        private readonly _clientProxy: ClientProxyService
    ) {}


    async processarPartida(_id: string, partida: Partida){
        try {
            const categoria: Categoria = await this._clientAdmin.send('consultar-categorias', partida.categoria).toPromise();
            await Promise.all(partida.jogadores.map(jogador => {
                const ranking = new this._rankingModel();
    
                ranking.categoria = partida.categoria;
                ranking.desafios = partida.desafio;
                ranking.partida = partida._id;
                ranking.jogador = jogador;
    
                if (jogador == partida.def){
                    let evento = categoria.eventos.find(event => event.nome == EventoEnum.VITORIA);

                    ranking.evento = EventoEnum.VITORIA;
                    ranking.pontos = evento.valor;
                    ranking.operacao = evento.operacao;

                } else {
                    let evento = categoria.eventos.find(event => event.nome == EventoEnum.DERROTA);

                    ranking.evento = EventoEnum.DERROTA;
                    ranking.pontos = evento.valor;
                    ranking.operacao = evento.operacao;
                }
    
                ranking.save();
            }))
        } catch (error) {
            this.logger.error(`error: ${error}`)
            throw new RpcException(error.message);
        }
    }

    consultarRankings(idCategoria, dataRef){
        this.logger.log(idCategoria, dataRef)
    }
}

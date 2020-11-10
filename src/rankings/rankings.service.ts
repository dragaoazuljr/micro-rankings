import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { Categoria, EventoEnum } from './interfaces/categoria.interface';
import { Partida } from './interfaces/partida.interface';
import { Ranking } from './interfaces/rankings.schema';
import * as momentTimezone from 'moment-timezone';
import { Desafio } from './interfaces/desafio.interface';
import * as _ from 'lodash';
import { Historico, RankingResponse } from './interfaces/rankings-response.interface';

@Injectable()
export class RankingsService {

    private logger = new Logger(RankingsService.name);
    private _clientAdmin = this._clientProxy.createProxyFactoryAdmin();
    private _clientDesafio = this._clientProxy.createProxyFactoryDesafios();


    constructor(
        @InjectModel('Rankings') private readonly _rankingModel: Model<Ranking>,
        private readonly _clientProxy: ClientProxyService
    ) { }


    async processarPartida(_id: string, partida: Partida) {
        try {
            const categoria: Categoria = await this._clientAdmin.send('consultar-categorias', partida.categoria).toPromise();
            await Promise.all(partida.jogadores.map(jogador => {
                const ranking = new this._rankingModel();

                ranking.categoria = partida.categoria;
                ranking.desafio = partida.desafio;
                ranking.partida = partida._id;
                ranking.jogador = jogador;

                if (jogador == partida.def) {
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

    async consultarRankings(idCategoria, dataRef) {
        if (!dataRef) {
            dataRef = momentTimezone().tz("America/Sao_Paulo").format('YYYY-MM-DD');
        }

        const resgistrosRanking = await this._rankingModel.find()
            .where('categoria')
            .equals(idCategoria)
            .exec();

        const desafios: Desafio[] = await this._clientDesafio.send('consultar-desafios-realizados', { idCategoria, dataRef }).toPromise()
        _.remove(resgistrosRanking, (item) => desafios.filter(desafio => desafio._id == item.desafio).length == 0)
        
        const resultado = _(resgistrosRanking)
            .groupBy('jogador')
            .map((items: Ranking[], key) => ({
                jogador: key,
                historico: _.countBy(items, 'evento'),
                pontos: _.sumBy(items.filter(item => item.evento == EventoEnum.VITORIA), 'pontos') - _.sumBy(items.filter((item) => item.evento == EventoEnum.DERROTA), 'pontos')
            }))
            .value()
        

        const resultadoOrdenado = _.orderBy(resultado, 'pontos', 'desc')

        const rankingResponseList: RankingResponse[] = [];
        resultadoOrdenado.map((item, i) => {
            const rankingResponse: RankingResponse = {};

            rankingResponse.jogador = item.jogador;
            rankingResponse.posicao = i + 1;
            rankingResponse.pontuacao = item.pontos;

            const historico: Historico = {};

            historico.derrotas = item.historico.DERROTA ? item.historico.DERROTA : 0;
            historico.vitorias = item.historico.VITORIA ? item.historico.VITORIA : 0;

            rankingResponse.historicoPartidas = historico;
            rankingResponseList.push(rankingResponse);
        })

        return rankingResponseList
    }
}

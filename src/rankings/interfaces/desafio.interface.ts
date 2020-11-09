import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export interface Desafio {
    dataHoraDesafio:     Date;
    status:              DesafioStatus;
    dataHoraSolicitacao: Date;
    dataHoraResposta:    Date;
    solicitante:         Jogador;
    categoria:           string;
    jogadores:           string[];
}

export enum DesafioStatus {
    REALIZADO = 'REALIZADO',
    PENDENTE = 'PENDENTE',
    ACEITO = 'ACEITO',
    NEGADO = 'NEGADO',
    CANCELADO = 'CANCELADO'
}

export interface Categoria {
    readonly categoria: string;
    descricao: string
    eventos: Array<Evento>
}

export interface Evento{
    nome: EventoEnum;
    operacao: string;
    valor: number;
}

export enum EventoEnum {
    VITORIA = 'VITORIA',
    DERROTA = 'DERROTA'
}
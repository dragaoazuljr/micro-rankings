export interface Partida {
    _id?: string;
    categoria: string;
    jogadores: string[];
    def: string;
    resultado: Resultado[];
    desafio: string;
}

export interface Resultado{
    set: string;
}
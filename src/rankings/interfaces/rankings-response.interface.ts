export interface RankingResponse {
    jogador?: string;
    posicao?: string;
    historicoPartidas?: Historico; 
}

export interface Historico {
    vitorias?: number;
    derrotas?: number;
}
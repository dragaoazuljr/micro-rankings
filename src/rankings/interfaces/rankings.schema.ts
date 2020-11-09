import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { EventoEnum } from './categoria.interface';

@Schema({
    timestamps: true,
    collection: 'rankings'
})
export class Ranking extends mongoose.Document {

    @Prop({type: mongoose.Schema.Types.ObjectId})
    desafios: string;

    @Prop({type: mongoose.Schema.Types.ObjectId})
    jogador: string;
    
    @Prop({type: mongoose.Schema.Types.ObjectId})
    partida: string;

    @Prop({type: mongoose.Schema.Types.ObjectId})
    categoria: string;

    @Prop()
    evento: EventoEnum;

    @Prop()
    operacao: string;

    @Prop()
    pontos: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
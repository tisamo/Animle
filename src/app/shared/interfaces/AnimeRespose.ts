import {Words} from "./words.inteface";

export interface Anime {
  id: number;
  type: string;
  title: string;
  japaneseTitle: string;
  description: string;
  emojiDescription: string; // optional string
  thumbnail: string; // optional string
  image: string;
  myanimeListId: number;
  properties: string;
}
export interface DailyResponse{
  id: string;
  type: string;
  anime:Array<Anime>;
  createdAt: Date;
}

export interface DailyGameResult{
  gameId: string;
  result: number;
  type: string;
}

export interface DailyGame{
  id: string;
  type: string;
  anime: Array<AnimeGame>;
  createdAt: Date;
}

export interface AnimeGame {
  id: number;
  title: string;
  type?: string;
  words: Words[];
  emojiDescription: string; // optional string
  thumbnail: string; // optional string
  image: string;
  myanimeListId: number;
  properties:string[];
}

export enum GameType{
  Emoji = 'emoji',
  Word = 'description',
  Image = 'image',
  Shuffled = 'shuffled'

}

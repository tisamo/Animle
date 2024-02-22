import {Anime, AnimeGame} from "./AnimeRespose";
import {User} from "./auth";
import {types} from "sass";
import List = types.List;
import {ListData} from "./list.interface";

export interface QuizCreation{
  title: string;
  animeIds: number[];
  selectedImageId: number;
}

export interface QuizResponse{
  id: number;
  title: string;
  createdAt: Date;
  animes: Anime[];
  thumbnail: string;
  user?: User;
}
export interface QuizGame{
  id: number;
  title: string;
  createdAt: Date;
  animes?: Anime[];
  thumbnail: string;
  user?: User;
}

export interface QuizList{
  quizzes: ListData<QuizResponse>;
  likedQuizzes: number[]
}

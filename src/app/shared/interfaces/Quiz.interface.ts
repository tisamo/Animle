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

interface BaseQuiz {
  id: number;
  title: string;
  createdAt: Date;
  thumbnail: string;
  user?: User;
}

export interface QuizResponse extends BaseQuiz {
  animes: Anime[];
}

export interface QuizGame extends BaseQuiz {
  animes?: Anime[];
}

export interface QuizList{
  quizzes: ListData<QuizResponse>;
  likedQuizzes: number[]
}

export type StoryGroupCreation = {
  name: string;
  description: string;
  image: string;
}

export type StoryGroup = StoryGroupCreation &{
  id: number;
  createdAt: Date;
  stories: any[];
}


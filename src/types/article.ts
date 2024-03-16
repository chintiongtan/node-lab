export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  LOGGED_IN = 'logged_in',
}

export type Article = {
  article_id: string;
  title: string;
  content: string;
  visibility: Visibility;
  user_id: string;
};

export type CreateArticleInput = {
  article_id: string;
  title: string;
  content: string;
  visibility: Visibility;
};

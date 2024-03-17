export type User = {
  user_id: string;
  login: string;
  password: string;
};

export type CreateUserInput = {
  user_id: string;
  login: string;
  password: string;
};

export type LoginInput = {
  login: string;
  password: string;
};

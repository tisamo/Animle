export type LoginInfos = {
  name: string;
  password: string;
  fingerprint: string;
};

export type RegisterInfos = {
  name: string;
  password: string;
  email: string;
};

export type User = {
  id?: number;
  name?: string;
  email?: string;
};

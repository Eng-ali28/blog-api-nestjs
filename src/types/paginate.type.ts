export type UserPagination = {
  limit?: string | number;
  page?: string | number;
};

export type Paginate = {
  page: string | number;
  result: string | number;
};
export type UserEntity = {
  id: string;
  fullname: string;
  email: string;
  role: string;
  posts?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
};
export type UsersResult = { paginate: Paginate; users: UserEntity[] };

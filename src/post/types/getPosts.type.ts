export class GetPostType {
  id: string;
  title: string;
  content: string;
  imageCover: string;
  images: string[];
  user: {
    id: string;
    fullname: string;
    imageCover: string;
    role: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  comments?: {
    id: string;
    content: string;
    users?: {
      id: string;
      fullname: string;
      imageCover: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export class returnGetPosts {
  message?: string;
  paginate?: { page: number | string; result: number | string };
  data?: GetPostType[];
}

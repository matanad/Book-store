export interface Book {
  id: string;
  title: string;
  author: Author;
  description: string;
  category: string;
  imgUrl: string;
  price: number;
}

export interface Author{
  id: string;
  name: string
}

export interface BookListResponse {
  books: Book[];
  totalPages: number;
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface IBooksFilter {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: number;
  title?: string;
  description?: string;
  author?: string;
  category?: string;
  [key: string]: any;
}

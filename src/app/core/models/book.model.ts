interface IBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  imgUrl: string;
  price: number;
}

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public description: string,
    public category: string,
    public imgUrl: string,
    public price: number
  ) {}

  static fromJson(bookJson: any): Book {
    return new Book(
      bookJson.id,
      bookJson.title,
      bookJson.author,
      bookJson.description,
      bookJson.category,
      bookJson.imgUrl,
      bookJson.price
    );
  }
}

export interface IBooksFilter {
    pageIdx?: number;
    sort?: string;
    order?: number;
    title?: string;
    description?: string;
    author?: string;
    category?: string;
    [key: string]: any;
  }
  
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  isAdmin?: boolean;
  token?: string;
}

export class User implements IUser {
  createdAt: Date;

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public isAdmin: boolean = false,
    public token: string = 'some-jwt-token'
  ) {
    this.createdAt = new Date();
  }
}

interface Options {
  id: string;
  name: string;
  email: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export class CreateCollaboratorDto {
  public name: string;
  public email: string;
  public position: string;
  constructor({ name, email, position }: Options) {
    this.name = name;
    this.email = email;
    this.position = position;
  }
}

export class Email {
  constructor(private value: string) {
    if (!this.validate(value)) {
      throw new Error("Invalid email address");
    }
  }

  private validate(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  getValue(): string {
    return this.value;
  }
}

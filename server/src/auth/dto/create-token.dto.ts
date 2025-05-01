export class CreateTokenDto {
  userId: string;
  value: string;

  constructor(userId: string, value: string) {
    this.userId = userId;
    this.value = value;
  }
}

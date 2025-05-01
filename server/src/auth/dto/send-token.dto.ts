export class SendTokenDto {
  token: string;
  expire: number;

  constructor(token: string, expire: number) {
    this.token = token;
    this.expire = expire / 1000;
  }
}

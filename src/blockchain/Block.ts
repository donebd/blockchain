import sha256 from 'crypto-js/sha256';

export class Block {
  public readonly index: number;
  public readonly data: string;
  public readonly hash: string;
  public readonly previousHash: string;

  constructor(index: number, data: string, previousHash: string) {
    this.index = index;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.hashcode();
  }

  public hashcode() {
    return sha256(this.index + this.previousHash + this.data).toString();
  }

}

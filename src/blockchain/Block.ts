import sha256 from 'crypto-js/sha256';

export class Block {
  public readonly index: number;
  public readonly data: string;
  public readonly previousHash: string;

  private nonce: number = 0;
  private _hash: string = this.hashcode();

  constructor(index: number, data: string, previousHash: string) {
    this.index = index;
    this.data = data;
    this.previousHash = previousHash;
  }

  public get hash(): string {
    if (this._hash) {
      return this._hash;
    }
    
    return this.hashcode();
  }

  public mineBlock(difficulty: number): void {
    while (!this.hash.endsWith('0'.repeat(difficulty))) {
      this.nonce++;
      this._hash = this.hashcode();
    }
  };

  private hashcode(): string {
    return sha256(this.index + this.previousHash + this.data + this.nonce).toString();
  }

}

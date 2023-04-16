import { getRandomString } from '../helpers/helpers';
import { Block } from './block';

export class Blockchain {

  public chain: Block[] = [this.createGenesisBlock()];

  public addBlock(block: Block): boolean {
    const lastBlock = this.getLastBlock();
    const hashIsValid = block.previousHash === lastBlock.hash;
    const indexIsValid = block.index === lastBlock.index + 1;

    if (indexIsValid && hashIsValid) {
      this.chain.push(block);
      return true;
    }

    return false;
  }

  public getLastBlock() {
    return this.getBlockByIndex(this.chain.length - 1)!;
  }

  public getBlockByIndex(index: number): Block | null {
    if (index < this.chain.length) {
        return this.chain[index];
    }

    return null;
  }

  private createGenesisBlock(): Block {
    return new Block(0, getRandomString(), 'genesis');
  }

}

import { Block } from "../../blockchain/block";
import { Blockchain } from "../../blockchain/blockchain";
import { blockChain } from "../../main";
import { MessageT } from "../../types";
import { NodeEnvironment } from "../nodeEnvironment";

export function handleSendChainMsg(parsedMessage: MessageT) {
    const { block, isLatest: isLast } = JSON.parse(parsedMessage.data[0]);
    const blockInst = Block.createInstance(block.index, block.data, block.hash, block.previousHash, block.nonce);

    if (!isLast) {
        return NodeEnvironment.tmp!.chain.push(blockInst);
    }

    NodeEnvironment.tmp!.chain.push(blockInst);
    blockChain.chain = NodeEnvironment.tmp!.chain;
    NodeEnvironment.tmp = new Blockchain();
    NodeEnvironment.tmp.chain = [];
}

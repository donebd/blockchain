import * as WebSocket from 'ws';
import { Block } from "../../blockchain/block";
import { PropertyReader } from '../../config/propertyReader';
import { ChainProtocolMsgType } from "../../enum/chainProtocolMsgType";
import { blockChain } from "../../main";
import { MessageT } from "../../types";
import { sendMessage } from '../server';
import { NodeEnvironment } from '../nodeEnvironment';

export function handleUpdateChainMsg(parsedMessage: MessageT, socket: WebSocket) {
    if (NodeEnvironment.checking) {
        return;
    }

    const blockObj = JSON.parse(parsedMessage.data[0]);
    const newBlock = Block.createInstance(blockObj.index, blockObj.data, blockObj._hash, blockObj.previousHash, blockObj.nonce)
    const newBlockTimestamp = parsedMessage.data[1];
    const chainLatestBlock = blockChain.getLastBlock();
    const isNew = newBlock.index === chainLatestBlock.index + 1;
    const hasBeenChecked = NodeEnvironment.checked.includes(
        JSON.stringify([chainLatestBlock.index, newBlock.previousHash]),
    );

    const getLastSymbols = (hash: string) => {
        const hashLength = hash.length;
        return hash.substring(hashLength - PropertyReader.getBlockchainDifficulty(), hashLength);
    };


    // Majority support
    if (isNew) {
        const indexIsValid = newBlock.index === chainLatestBlock.index + 1;
        const hashLastFourSymbols = getLastSymbols(newBlock.hash);
        const zerosString = Array(PropertyReader.getBlockchainDifficulty() + 1).join('0');
        const validZerosNum = hashLastFourSymbols === zerosString;

        const prevHashMatch = chainLatestBlock.hash === newBlock.previousHash;

        if (isNew && indexIsValid && validZerosNum && prevHashMatch) {
            blockChain.chain.push(newBlock);
            NodeEnvironment.lastBlockMinedAt = newBlockTimestamp;
        }
        return;
    }

    if (hasBeenChecked) {
        return socket.send(JSON.stringify({
            type: ChainProtocolMsgType.UPDATE_CHAIN,
            data: [JSON.stringify(blockChain.getLastBlock()),
            NodeEnvironment.lastBlockMinedAt,
            ],
        }));
    }

    NodeEnvironment.checked.push(
        JSON.stringify([
            blockChain.getLastBlock().index,
            blockChain.getLastBlock().previousHash,
        ]),
    );

    const lastIdx = blockChain.chain.length - 1;

    NodeEnvironment.checking = true;

    sendMessage(JSON.stringify({
        type: ChainProtocolMsgType.REQUEST_CHECK,
        data: [PropertyReader.getAddress(), (newBlock.index).toString()],
    }));

    setTimeout(() => {
        if (blockChain.getBlockByIndex(newBlock.index)) {
            NodeEnvironment.check.push([
                JSON.stringify(blockChain.getBlockByIndex(newBlock.index)),
                NodeEnvironment.lastBlockMinedAt,
                PropertyReader.getAddress()
            ]);
        }

        NodeEnvironment.checking = false;

        const countAppearances = () => {
            return NodeEnvironment.check.filter((group) =>
                group[0] === mostAppearedGroup[0],
            ).length;
        };

        let mostAppearedGroup = NodeEnvironment.check[0][0];
        let timesAppeared = countAppearances();
        let timestampOfMAG = JSON.parse(NodeEnvironment.check[0][1]);

        // Remove duplicates
        const checkSet = new Set(NodeEnvironment.check);
        NodeEnvironment.check = Array.from(checkSet);

        NodeEnvironment.check.forEach((group) => {
            const appearCnt = NodeEnvironment.check.filter((gr) => gr === group).length;
            const timestamp = JSON.parse(group[1]);

            if (appearCnt > timesAppeared) {
                mostAppearedGroup = group[0];
                timesAppeared = appearCnt;
                timestampOfMAG = timestamp;
            } else {
                if (appearCnt === timesAppeared && (timestamp < timestampOfMAG)) {
                    mostAppearedGroup = group[0];
                    timesAppeared = appearCnt;
                    timestampOfMAG = timestamp;
                }
            }
        });

        const group = JSON.parse(mostAppearedGroup);
        const blockFromGroup = Block.createInstance(group.index, group.data, group.hash, group.previousHash, group.nonce);

        if (blockFromGroup.index < lastIdx) {
            blockChain.chain = blockChain.chain.slice(0, blockFromGroup.index);
            blockChain.chain[blockFromGroup.index] = blockFromGroup;
        } else {
            blockChain.chain[lastIdx] = blockFromGroup;
        }

        NodeEnvironment.check.splice(0, NodeEnvironment.check.length);
    }, 4000);

}

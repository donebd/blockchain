import { Block } from './blockchain/block';
import { Blockchain } from './blockchain/blockchain';
import { PropertyReader } from './config/propertyReader';
import { ChainProtocolMsgType } from './enum/chainProtocolMsgType';
import { getRandomString, wait } from './helpers/helpers';
import { NodeEnvironment } from './network/nodeEnvironment';
import { connectedPeers, openedSockets, sendMessage } from './network/server';

export const blockChain = new Blockchain();

process.on('ERROR', (err) => console.log('ERROR', err));

startNodeMining();
heartLogging();

async function startNodeMining() {
    while (true) {
        await new Promise<void>( async resolve => {
           await wait(5000);
            const newBlock = new Block(
                blockChain.getLastBlock().index + 1,
                getRandomString(),
                blockChain.getLastBlock().hash
            );

            if (NodeEnvironment.checking) {
                return;
            }

            newBlock.mineBlock(PropertyReader.getBlockchainDifficulty())
            blockChain.addBlock(newBlock);
            NodeEnvironment.lastBlockMinedAt = JSON.stringify(Date.now());
            sendMessage(JSON.stringify({
                type: ChainProtocolMsgType.UPDATE_CHAIN,
                data: [JSON.stringify(blockChain.getLastBlock()),
                NodeEnvironment.lastBlockMinedAt,
                ],
            }));
            resolve();
        });
    }
}

function heartLogging() {
    setInterval(() => {
        console.log(`      Node address: ${PropertyReader.getAddress()}
          Timestamp: ${new Date().toUTCString()}
          Node opened sockets: ${openedSockets.length}
          Connected addresses: ${JSON.stringify(connectedPeers)}
          Chain: ${JSON.stringify(blockChain.chain)}
      `);
    }, 5000);
}

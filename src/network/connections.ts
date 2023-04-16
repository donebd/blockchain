import * as WebSocket from 'ws';
import { Blockchain } from '../blockchain/blockchain';
import { PropertyReader } from '../config/propertyReader';
import { ChainProtocolMsgType } from '../enum/chainProtocolMsgType';
import { connectedPeers, openedSockets } from './server';
import { NodeEnvironment } from './nodeEnvironment';

export async function connect(address: string) {
    const socket = new WebSocket(address);
    const isItNodeAdrress = address === PropertyReader.getAddress();
    const needSocketOpen = !(checkIfConnectionOpened(address) || isItNodeAdrress);
    const needConnection = !(checkIfConnected(address) || isItNodeAdrress);

    if (!needConnection) {
        return;
    }

    socket.on('close', () => {
        disconnect(address);
    });

    socket.on('open', () => {
        if (needSocketOpen) {
            openedSockets.push({
                socket,
                address,
            });
        }

        connectedPeers.push(address);

        socket.send(
            JSON.stringify({
                type: ChainProtocolMsgType.HANDSHAKE,
                data: [PropertyReader.getAddress(), ...connectedPeers],
            }),
        );

        connectToOtherPeers(address);

        if (NodeEnvironment.tmp) {
            return;
        }

        if (openedSockets.length !== 0) {
            return socket.send(
                JSON.stringify({
                    type: ChainProtocolMsgType.REQUEST_CHAIN,
                    data: [PropertyReader.getAddress(), address],
                }),
            )
        }

        NodeEnvironment.tmp = new Blockchain();
    });

}

function disconnect(address: string) {
    const addressIdx = connectedPeers.indexOf(address);

    openedSockets.splice(addressIdx, 1);
    connectedPeers.splice(addressIdx, 1);
}

function connectToOtherPeers(address: string) {
    openedSockets.forEach((node) => {
        const messageAsString = JSON.stringify({
            type: ChainProtocolMsgType.HANDSHAKE,
            data: [address],
        });

        node.socket.send(messageAsString);
    });
}

function checkIfConnectionOpened(address: string) {
    return openedSockets.find((socket) =>
        socket.address === address,
    );
}

function checkIfConnected(address: string) {
    return connectedPeers.find((peerAddress) =>
        peerAddress === address,
    );
}

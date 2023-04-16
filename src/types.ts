import * as WebSocket from 'ws';
import { Block } from './blockchain/block';
import { ChainProtocolMsgType } from './enum/chainProtocolMsgType';

export type ChainElementT = {
    block: Block;
    isLast: boolean
}

export type MessageT = {
    type: ChainProtocolMsgType;
    data: string[];
}

export type SocketT = {
    socket: WebSocket;
    address: string;
}

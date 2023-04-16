import WebSocket, { WebSocketServer } from 'ws';
import { PropertyReader } from '../config/propertyReader';
import { ChainProtocolMsgType } from '../enum/chainProtocolMsgType';
import { MessageT, SocketT } from '../types';
import { connect } from './connections';
import { handleHandshakeMsg } from './handlers/handshake';
import { handleRequestChainMsg } from './handlers/requestChain';
import { handleRequestCheckMsg } from './handlers/requestCheck';
import { handleSendChainMsg } from './handlers/sendChain';
import { handleSendCheckMsg } from './handlers/sendCheck';
import { handleUpdateChainMsg } from './handlers/updateChain';

const server = new WebSocketServer({ port: PropertyReader.getPort() });

export const openedSockets: SocketT[] = [];
export const connectedPeers: string[] = [];

server.on('connection', async (socket: WebSocket) => {
  socket.on('message', (message: string) => {
    const parsedMessage: MessageT = JSON.parse(message);

    switch (parsedMessage.type) {
      case ChainProtocolMsgType.HANDSHAKE:
        handleHandshakeMsg(parsedMessage);
        break;
      case ChainProtocolMsgType.SEND_CHAIN:
        handleSendChainMsg(parsedMessage)
        break;
      case ChainProtocolMsgType.UPDATE_CHAIN:
        handleUpdateChainMsg(parsedMessage, socket)
        break;
      case ChainProtocolMsgType.REQUEST_CHAIN:
        handleRequestChainMsg(parsedMessage);
        break;
      case ChainProtocolMsgType.SEND_CHECK:
        handleSendCheckMsg(parsedMessage);
        break;
      case ChainProtocolMsgType.REQUEST_CHECK:
        handleRequestCheckMsg(parsedMessage)
        break;
    }
  });
})

PropertyReader.getPeers().forEach((peer) => connect(peer));

export function sendMessage(message: string) {
  openedSockets.forEach((node) => {
    node.socket.send(message);
  });
}

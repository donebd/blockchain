import WebSocket from 'ws';
import { Block } from "../../blockchain/block";
import { PropertyReader } from "../../config/propertyReader";
import { ChainProtocolMsgType } from "../../enum/chainProtocolMsgType";
import { blockChain } from "../../main";
import { ChainElementT, MessageT } from "../../types";
import { openedSockets } from "../server";

export function handleRequestChainMsg(parsedMessage: MessageT) {
  const parsedURL = parsedMessage.data[0];
  const myAddress = parsedMessage.data[1] === PropertyReader.getAddress();

  if (myAddress) {
    waitForSocketToOpenAndSend(parsedURL);
  }
}

function waitForSocketToOpenAndSend(url: string) {
  const filteredByAddress = openedSockets.filter(
    (node) => node.address === url,
  );

  if (filteredByAddress.length !== 0) {
    const socketToSendTo = filteredByAddress[0].socket;
    return sendChainPartly(socketToSendTo, blockChain.chain);
  }

  setTimeout(() => {
    waitForSocketToOpenAndSend(url);
  }, 500);
}

function sendChainPartly(dest: WebSocket, chain: Block[]) {
  for (let i = 0; i < chain.length; i++) {
    const block: ChainElementT = {
      block: chain[i],
      isLast: i === chain.length - 1,
    };

    const msg = {
      type: ChainProtocolMsgType.SEND_CHAIN,
      data: [JSON.stringify(block)],
    };

    dest.send(JSON.stringify(msg));
  }
}

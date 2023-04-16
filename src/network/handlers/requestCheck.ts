import { PropertyReader } from "../../config/propertyReader";
import { ChainProtocolMsgType } from "../../enum/chainProtocolMsgType";
import { blockChain } from "../../main";
import { MessageT } from "../../types";
import { openedSockets } from "../server";
import { NodeEnvironment } from "../nodeEnvironment";

export function handleRequestCheckMsg(parsedMessage: MessageT) {
    NodeEnvironment.socketSendTo = openedSockets.filter(
        (node) => node.address === parsedMessage.data[0],
    )[0].socket;
    const dataIdx = Number(parsedMessage.data[1]);

    if (!blockChain.getBlockByIndex(dataIdx)) {
        return;
    }

    const msg = {
        type: ChainProtocolMsgType.SEND_CHECK,
        data: [JSON.stringify(blockChain.getBlockByIndex(dataIdx)), NodeEnvironment.lastBlockMinedAt, PropertyReader.getAddress()],
    };

    NodeEnvironment.socketSendTo.send(
        JSON.stringify(msg),
    );
}

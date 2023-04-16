import { Blockchain } from "../../blockchain/blockchain";
import { blockChain } from "../../main";
import { MessageT } from "../../types";
import { connect } from "../connections";
import { NodeEnvironment } from "../nodeEnvironment";

export function handleHandshakeMsg(parsedMessage: MessageT) {
    const nodes = parsedMessage.data;

    NodeEnvironment.tmp = new Blockchain();
    NodeEnvironment.tmp.chain = [];

    nodes.forEach((node) => {
        connect(node);
    });
}

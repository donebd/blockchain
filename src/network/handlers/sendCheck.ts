import { MessageT } from "../../types";
import { NodeEnvironment } from "../nodeEnvironment";

export function handleSendCheckMsg(parsedMessage: MessageT) {
    if (NodeEnvironment.checking) {
        NodeEnvironment.check.push([
            parsedMessage.data[0], // block
            parsedMessage.data[1], // timestamp
            parsedMessage.data[2], // address
        ]);
    }
}

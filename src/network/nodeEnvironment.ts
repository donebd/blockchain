import { Blockchain } from "../blockchain/blockchain";
import * as WebSocket from 'ws';

export class NodeEnvironment {

    public static check: Array<string[]> = [];
    public static checked: string[] = [];
    public static checking = false;

    public static tmp: Blockchain;
    public static lastBlockMinedAt: string;

    public static socketSendTo: WebSocket;

}

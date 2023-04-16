import propertiesReader from 'properties-reader';
import * as path from 'path';

export class PropertyReader {
    private static DEFAULT_ADDRESS = "ws://localhost";
    private static DEFAULT_PORT = 8080;
    private static DEFAULT_PEERS: string[] = [];
    private static DEFAULT_DIFFICULTY = 4;

    private static propertiesReader = propertiesReader(path.join(__filename, '..', 'blockchain.properties'));

    public static getAddress(): string {
        const address = this.getProperty("address");
        if (address) {
            return `${address}:${this.getPort()}`;
        }
        return `${this.DEFAULT_ADDRESS}:${this.getPort()}`;
    }

    public static getPort(): number {
        const port = this.getProperty("port");
        if (port) {
            return Number(port);
        }
        return this.DEFAULT_PORT;
    }

    public static getPeers(): string[] {
        const peersString = this.getProperty("peers");
        if (peersString) {
            return peersString.split(' ');
        }
        return this.DEFAULT_PEERS;
    }

    public static getBlockchainDifficulty(): number {
        const difficulty = this.getProperty("difficulty");
        if (difficulty) {
            return Number(difficulty);
        }
        return this.DEFAULT_DIFFICULTY;
    }

    private static getProperty(name: string): string | null {
        let result = this.propertiesReader.get(name);
        if (!result) {
            return null;
        }
        return result as string;
    }

}

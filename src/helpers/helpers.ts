import * as randomstring from "randomstring";

export function getRandomString(): string {
    return randomstring.generate({
        length: 256,
        charset: 'hex'
    });
}


export async function wait(ms: number) {
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    })
}

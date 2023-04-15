import randomstring from "randomstring";

export function getRandomString(): string {
    return randomstring.generate({
        length: 256,
        charset: 'hex'
      });
  };

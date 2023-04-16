FROM node:18

RUN mkdir blockchain

COPY . blockchain

WORKDIR blockchain

RUN npm install

ENV ADDRESS=ws://
ENV PEERS=
ENV PORT=8080
ENV DIFFICULTY=4

CMD npm run start

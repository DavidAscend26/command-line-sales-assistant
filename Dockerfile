FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY jest.config.ts ./

RUN npm install

COPY src ./src
COPY test ./test
COPY README.md ./

RUN npm run build

CMD ["node", "dist/index.js"]
FROM node:18 as base

RUN npm install -g pnpm

RUN npx playwright install

RUN npx playwright install-deps

WORKDIR /zot-bot

COPY . ./

FROM base as deps

RUN pnpm install

CMD ["pnpm", "start"]
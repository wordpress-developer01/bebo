FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install
COPY tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.ts postcss.config.cjs ./
COPY index.html ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

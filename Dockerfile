FROM node:22-alpine

WORKDIR /app

RUN npm install -g tube-search-mcp@1.0.2

ENTRYPOINT ["tube-search-mcp"]

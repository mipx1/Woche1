FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# TypeScript → JavaScript kompilieren
RUN npm run build

# Start mit der kompilierten JS-Datei
CMD ["npm", "start"]

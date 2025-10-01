# Node.js Basis-Image (ARM/AMD kompatibel)
FROM node:22-slim

# Arbeitsverzeichnis
WORKDIR /app

# package.json & package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# Standardbefehl
CMD ["npm", "run", "dev"]

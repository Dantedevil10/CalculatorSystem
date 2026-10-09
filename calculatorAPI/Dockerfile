FROM node:24-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o código-fonte
COPY . .

# Expõe a porta utilizada pela API
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "src/index.js"]
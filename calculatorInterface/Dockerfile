# Estágio 1: Build do React + Vite
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Servidor estático com Nginx
FROM nginx:alpine

# Copia a pasta de build gerada no estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 do Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
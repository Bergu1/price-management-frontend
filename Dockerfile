# --- deps ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- dev: hot reload ---
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
# Windows/WSL2 – wymuś polling:
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV VITE_HMR_CLIENT_PORT=5173
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]

# --- build: produkcyjny bundle ---
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# --- prod: serwowanie przez nginx ---
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

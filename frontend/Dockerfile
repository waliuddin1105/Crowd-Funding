# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Hardcode production URLs (Railway doesn't pass build args properly)
ENV VITE_BACKEND_URL=https://backend-flask-production-0e2b.up.railway.app
ENV VITE_RAG_URL=https://rag-production-368f.up.railway.app/api/rag

COPY package*.json ./

RUN npm ci

COPY . .

# Build with environment variables baked in
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
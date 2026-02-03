# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Build arguments for VITE environment variables (must be set at build time)
ARG VITE_BACKEND_URL
ARG VITE_RAG_URL

# Set as environment variables for the build process
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_RAG_URL=$VITE_RAG_URL

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
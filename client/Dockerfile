# ---- Stage 1: build the static React app ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# This is the Vite gotcha: VITE_API_URL must be passed in
# at BUILD time (as an ARG), not as a normal runtime env var,
# because Vite bakes it into the JS bundle during `npm run build`.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Stage 2: serve the built static files with nginx ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
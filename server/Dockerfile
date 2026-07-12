FROM node:20-alpine

WORKDIR /app

# Copy only package files first, so npm install is cached
# and doesn't re-run every time you change source code
COPY package*.json ./
RUN npm install --omit=dev

# Now copy the rest of the source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
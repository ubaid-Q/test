# Stage 1: Build the whole system
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma migrate dev

# Stage 2: Run tests
FROM builder AS tester
RUN npx jest

# Stage 3: Create the final image
FROM builder AS final
EXPOSE 4000

CMD ["npm", "start"]

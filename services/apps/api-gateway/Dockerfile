FROM node:18-alpine as Builder
RUN apk add --no-cache --virtual g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx run-many --target=build --projects=api-gateway

FROM node:18-alpine as production
WORKDIR /app
COPY --from=Builder /app/dist/apps/api-gateway .
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install --production
CMD node ./main.js
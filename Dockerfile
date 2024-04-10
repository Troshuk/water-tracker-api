FROM node:18-alpine

WORKDIR /usr/src/app

ENV DB_HOST mongodb://mongodb:27017
ENV DB_NAME water-consumption
ENV DB_USER=
ENV DB_PASSWORD=
ENV DB_PORT 27017

# This is used when we use the local code as a volume
ENTRYPOINT ["sh", "-c", "npm install && exec \"$@\"", "--"]

EXPOSE ${PORT} ${DB_PORT}

CMD ["npm", "run", "dev"]
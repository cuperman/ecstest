FROM node:14.17.6

RUN mkdir /opt/app
COPY ./backend/build /opt/app

EXPOSE 3000

CMD ["node", "/opt/app/index.js"]

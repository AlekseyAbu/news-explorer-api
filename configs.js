require('dotenv').config();

const {
  NODE_ENV, JWT_SECRET, DB_LINK, PORT,
} = process.env;

const devSecret = 'dev-secret';
const devDbLink = 'mongodb://localhost:27017/project-diplom';
const devServerPort = 3000;
const SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : devSecret;
const DB = NODE_ENV === 'production' && DB_LINK ? DB_LINK : devDbLink;
const SERVER_PORT = NODE_ENV === 'production' && PORT ? PORT : devServerPort;

module.exports = {
  SECRET,
  DB,
  SERVER_PORT,
};

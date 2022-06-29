import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 80;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API ROUTES
// app.use('/', router);
// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
});

// SERVER
app.set('port', PORT);
const server = http.createServer(app);
server.on('listening', () => {
  console.log('Listening on ' + PORT);
});

server.listen(PORT);
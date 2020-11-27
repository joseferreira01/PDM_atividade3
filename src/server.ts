import express from 'express';
import path from 'path'

import cors from 'cors';

import 'express-async-errors';

import './database/connection';
import errorHandler from './err/handler';

import routes from './routes/index';

const server = express();

server.use(express.json());
server.use(cors())
server.use(routes);

server.use('/upload', express.static(path.join(__dirname, '..', 'upload')));
server.use(errorHandler)


server.listen(3333, () => {
  console.log('server online');
});

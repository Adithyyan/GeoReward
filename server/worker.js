import { createServer } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import app from './src/index.js';

const PORT = 3001;
const server = createServer(app);
server.listen(PORT);

export default httpServerHandler({ port: PORT });

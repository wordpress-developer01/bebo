import { env } from './config/env.js';
import { createServer } from './server.js';

const app = createServer();

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});

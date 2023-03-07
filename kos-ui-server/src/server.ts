import 'dotenv/config';

import app from './app';

const { PORT = 8086 } = process.env;
const listener = () => console.log(`Listening on port ${PORT}`);

async function start() {
  try {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  } catch (error) {
    console.error(error);
  }
  app.listen(PORT, listener);
}

start();

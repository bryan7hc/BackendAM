// backend/src/config/mercadopago.js

import { createRequire } from 'module';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default mercadopago;

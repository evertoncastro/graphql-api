import express from 'express';
import 'dotenv/config';

const app = express();
app.get('/', (req, res) => {
  res.json({ status: 'Server is running!' });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running at localhost, port:${process.env.PORT}`);
});

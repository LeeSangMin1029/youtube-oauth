import express, { Request, Response, NextFunction } from 'express';
const app = express();
const host = 5000;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('home');
});

app.listen(host, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${host}
  ################################################
`);
});

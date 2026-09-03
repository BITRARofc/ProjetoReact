import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

const contatos = [
    { id: 1, nome: "Mauro", email: "canivetada@teste.com"},
    { id: 2, nome: "Samuel", email: "autismo@teste.com"},
    { id: 3, nome: "Yan", email: "vicio@teste.com"},
    { id: 4, nome: "Marcos", email: "baixarias@teste.com"}
]

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/contatos', (req: Request, res: Response) => {
  res.json(contatos);
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
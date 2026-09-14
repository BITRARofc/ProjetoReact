import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { Pool } from "pg";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

async function testarDB() {
  try {
    const result = await pool.query('SELECT * FROM contatos')

    console.log("Banco de Dados Conectado!", result.rows)
  } catch (error) {
    console.error('Erro ao conectar com o BD: ', error)
  }
}

app.use(morgan("dev"));

app.use(helmet());


const contatos = [
    { id: 1, name: "Mauro", email: "canivetada@teste.com"},
    { id: 2, name: "Samuel", email: "autismo@teste.com"},
    { id: 3, name: "Yan", email: "vicio@teste.com"},
    { id: 4, name: "Marcos", email: "baixarias@teste.com"},
]

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/contatos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM contatos');

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error: "Erro Interno no Servidor"})
  };
});

app.post('/api/contatos', (req: Request, res: Response) => {
  const {name, email} = req.body;

  if (!name || !email) {
    return res.status(400).json({ erro: "Nome e Email são obrigatórios" })
  }

  const novoId = contatos.length > 0 ? Math.max(...contatos.map(c => c.id)) + 1 : 1;

  const novoContato = {id: novoId, name, email};
  contatos.push(novoContato);

  return res.status(201).json(novoContato);
});

app.put("/api/contatos/:id", (req: Request, res: Response)=> {
  const id = Number(req.params.id);
  const {name, email} = req.body;

  const index = contatos.findIndex(c => c.id === id);

  const contatoExistente = contatos[index];

  if (!contatoExistente) {
    return res.status(404).json({ erro: "Contato não encontrado"})
  }
  
  const contatoAtualizado = {
    ...contatoExistente,
    name: name ?? contatoExistente.name,
    email: email ?? contatoExistente.email,
  };
  
  contatos[index] = contatoAtualizado;

  res.json(contatoAtualizado);
});

app.delete("/api/contatos/:id", (req: Request, res: Response)=> {
  const id = Number(req.params.id);
  const index = contatos.findIndex((c)=> c.id === id)

  if (index === -1) {
    return res.status(404).json({
      erro: "Contato não encontrado!"
    })
  }
  
  contatos.splice(index,1);
  return res.status(204).send();

});



app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
  testarDB()
});
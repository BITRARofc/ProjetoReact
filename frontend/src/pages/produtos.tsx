import { useState } from "react";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

function Produtos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [edicao, setEdicao] = useState<number | null>(null);

  async function BuscarUsuario() {
    const resposta = await fetch(
      `https://jsonplaceholder.typicode.com/users?name_like=${name}`,
    );
    const dados = await resposta.json();
    const resultado = dados.filter((usuario: Usuario) => [
      usuario.name.toLowerCase().includes(name.toLowerCase()),
    ]);
    setUsuarios(resultado);
  }

  async function CadastrarUsuarios() {
    if (name === "" || email === "" || !email.includes("@")) {
      return;
    }
    const resposta = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "Post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: name,
        email: email
      })
    });
    const novoUsuario = await resposta.json();
    setUsuarios([...usuarios, novoUsuario]);
    setName("");
    setEmail("");
  }

  /* function CadastrarUsuario() {
    if (name === "" || email === "" || !email.includes("@")) {
      return;
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      name: name,
      email: email,
    };

    setUsuarios([...usuarios, novoUsuario]);

    setName("");
    setEmail("");
  } */

  function EditarUsuarios(id: number) {
    const usuario = usuarios.find((usuario) => usuario.id === id);

    if (usuario) {
      setName(usuario.name);
      setEmail(usuario.email);
      setEdicao(id);
    };
  };

  function SalvarEdicao() {
    setUsuarios(
      usuarios.map((usuario) => {
        if (usuario.id === edicao) {
          return {
            ...usuario,
            name: name,
            email: email
          };
        }

        return usuario;
      }),
    );
    setEdicao(null);
    setName("");
    setEmail("");
  };

  function CancelarEdicao() {
    if (edicao) {
      setEdicao(null);
      setName("");
      setEmail("");
    };
  }

  function DeletarUsuario(id: number) {
    const usuariosAtualizados = usuarios.filter(
      (usuario) => usuario.id !== id
    );
    setUsuarios(usuariosAtualizados);
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text=4xl mb-6 font-bold">Pesquisar Usuario</h1>
      <div>
        <input
          type="text"
          placeholder="Digite parte de um nome..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border p-3"
        />
        <input
          type="email"
          placeholder="Digite um email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg border p-3"
        />
        <div className="flex gap-2">
          <button
            className={`cursor-pointer rounded-lg px-4 py-2 text-white ${edicao === null ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600" }`}
            onClick={edicao === null ? BuscarUsuario : CancelarEdicao}
          >
            {edicao === null ? "Buscar" : "Cancelar Edição"}
          </button>
          <button
            className={`cursor-pointer rounded-lg px-4 py-2 text-white ${edicao === null ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600" }`}
            onClick={edicao === null ? CadastrarUsuarios : SalvarEdicao}
          >
            {edicao === null ? "Cadastrar" : "Salvar Edição"}
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 space-y-4">
          {usuarios.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="rounded border p-4">
                <h2 className="text-xl font-bold">{usuario.name} id: {usuario.id}</h2>
                <p className="text-gray-600">{usuario.email}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    onClick={() => EditarUsuarios(usuario.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => DeletarUsuario(usuario.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Produtos;

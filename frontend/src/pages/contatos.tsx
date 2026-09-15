import { useState, useEffect } from "react";

type Contato = {
  id: number;
  name: string;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/contatos";

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
  });

  async function BuscarContatos() {
    try {
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar contato");
      }

      const dados = await resposta.json();

      setContatos(dados);
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  async function deletarContatos(id: number) {
    try {
      setErro("");

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar contato!");
      }

      await BuscarContatos();
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro inesperado!";
      setErro(mensagem);
    }
  }

  async function cadastrarContatos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setErro("");

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar contato!");
      }

      await BuscarContatos();
      setForm({
        id: 0,
        name: "",
        email: "",
      });
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro inesperado!";
      setErro(mensagem);
    }
  }

  async function atualizarContatos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setErro("");

      const resposta = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar contato!");
      }

      await BuscarContatos();
      setForm({
        id: 0,
        name: "",
        email: "",
      });
      setEditando(false);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro inesperado!";
      setErro(mensagem);
    }
  }

  async function editarContatos(contato: Contato) {
    setForm({
      id: contato.id,
      name: contato.name,
      email: contato.email,
    });
    setEditando(true);
    setErro("");
  }

  function cancelarEdicao(){
    setForm({
        id: 0,
        name: "",
        email: "",
      });
      setEditando(false);
  }

  useEffect(() => {
    let ativo = true;
    async function carregarContatos() {
      try {
        setCarregando(true);
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
          throw new Error("Erro ao buscar contatos.");
        }
        const dados = await resposta.json();
        if (ativo) {
          setContatos(dados);
        }
      } catch (err) {
        if (ativo) {
          setErro((err as Error).message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }
    void carregarContatos();
    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center">
        <p className="font-bold text-blue-800">Carregando Contatos</p>
      </div>
    );
  }

  if (erro) {
    return <div className="flex justify-center text-red-700">{erro}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Lista de Contatos</h1>
      {erro && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {erro}
        </div>
      )}
      <form
        onSubmit={editando ? atualizarContatos : cadastrarContatos}
        className="mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(event) =>
            setForm({
              ...form,
              name: event.target.value,
            })
          }
          className="w-full rounded border p-2"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
          className="w-full rounded border p-2"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`cursor-pointer rounded-lg px-5 py-2 text-white ${
              editando
                ? "bg-green-500 hover:bg-green-700"
                : "bg-violet-700 hover:bg-violet-800"
            }`}
          >
            {editando ? "Atualizar" : "Cadastrar"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="cursor-pointer rounded-lg bg-gray-500 px-5 py-2 text-white hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {contatos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum contato encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {contatos.map((contato) => (
            <li
              key={contato.id}
              className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold"> {contato.name} </h2>
                  <p className="text-gray-600"> {contato.email} </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editarContatos(contato)}
                    className="cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deletarContatos(contato.id)}
                    className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

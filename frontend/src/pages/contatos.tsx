import { useState, useEffect } from "react";

type Contato = {
  id: number;
  name: string;
  email: string;
};



function Contatos() {

    const [contatos, setContatos] = useState<Contato[]>([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function BuscarContatos() {
            try {
                const resposta = await fetch("http://localhost:3000/api/contatos");

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

        BuscarContatos();
    }, []);

    if (carregando) {
        return (
            <div className="flex justify-center">
                <p className="text-blue-800 font-bold">Carregando Contatos</p>
            </div>
        )
    }

    if (erro) {
        return (
            <div className="flex justify-center text-red-700">
                {erro}
            </div>
        )
    }

    return (
        <main className="mx-auto max-w-5xl p-6">
            <div>
                <h1 className="text=4xl mb-6 font-bold">Lista de Contatos</h1>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 space-y-4">
                {contatos.length === 0 ? (
                    <p>Nenhum Contato Encontrado.</p> 
                ):(
                    contatos.map((contato) => (
                        <div key={contato.id} className="p-5 border border-gray-950 rounded-[10px] shadow shadow-gray-600">
                            <h2 className="text-xl"><span className="font-bold">Nome: </span>{contato.name}</h2>
                            <p className=""><span className="font-bold">Email: </span>{contato.email}</p>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default Contatos;
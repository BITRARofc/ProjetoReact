import Botao from "../components/botao";

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e0aa6b]">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-5xl font-bold text-violet-800">Hello World</h1>
        <p className="mt-3">Bem Vindo ao meu primeiro React com Tailwind CSS</p>
        <div className="mt-5 flex justify-center gap-2 align-middle">
          <Botao texto="Comprar" cor="bg-violet-700" hover="hover:bg-violet-500"></Botao>
          <Botao texto="Vender" cor="bg-zinc-700" hover="hover:bg-zinc-500"></Botao>
        </div>
      </div>
    </main>
  );
}

export default Home;

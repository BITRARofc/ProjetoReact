import { Link, Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/home";
import Produtos from "./pages/produtos";
import Contatos from "./pages/contatos";

function App() {
  return (
    <main className="min-h-screen">
      <nav className="flex gap-6 bg-[#252525] bg-blue-900 p-4 text-white">
        <Link to="/">Home</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/contatos">Contatos</Link>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/contatos" element={<Contatos />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;

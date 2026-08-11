type BotaoProps = {
    texto: string;
    cor: string;
    hover?: string
}

function Botao({texto, cor, hover}: BotaoProps) {
    return (
        <button className={`${cor} text-white px-3 py-2 rounded-lg ${hover}`}>{texto}</button>
    )
}

export default Botao;
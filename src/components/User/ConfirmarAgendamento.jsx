import { useState, useEffect } from "react";
import { calcularHorarioFinal, formatarDuracao } from "../../utils/timeUtils";
import "./ConfirmarAgendamento.css";

const ConfirmarAgendamento = ({data, updateFieldHandler, onSuccess}) => {
    const [nomeQuadra, setNomeQuadra] = useState("Carregando...");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuadraNome = async () => {
            if (!data.id_quadra) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/quadra/${data.id_quadra}`);
                if (response.ok) {
                    const result = await response.json();
                    const quadraInfo = Array.isArray(result) ? result[0] : result;
                    
                    if (quadraInfo && quadraInfo.nome) {
                        setNomeQuadra(quadraInfo.nome);
                    } else {
                         setNomeQuadra(`Quadra #${data.id_quadra}`);
                    }
                } else {
                    setNomeQuadra(`Quadra #${data.id_quadra}`);
                }
            } catch (error) {
                console.error("Erro ao buscar nome da quadra:", error);
                setNomeQuadra(`Quadra #${data.id_quadra}`);
            }
        };

        fetchQuadraNome();
    }, [data.id_quadra]);

    return (
        <div>
            <div className="agendamento-detalhes">
                <h3>Deseja confirmar o agendamento?</h3>
                <p> <strong>Quadra: </strong> {nomeQuadra}</p>
                <p> <strong>Data selecionada: </strong> {data.dia.split('-').reverse().join('/')}</p>
                <p> <strong>Duração do agendamento: </strong> {formatarDuracao(data.duracao)}</p>
                <p> <strong>Horário de início: </strong> {data.horario}</p>
                <p> <strong>Horário de término: </strong> {calcularHorarioFinal(data.horario, data.duracao)}</p>
                <p> <strong>Valor total: </strong> R$ {Number(data.quadra_valor_hora * data.duracao).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    );
};

export default ConfirmarAgendamento;
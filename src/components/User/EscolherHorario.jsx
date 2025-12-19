import { useState, useEffect } from "react";
import "./EscolherHorario.css";
import { calcularHorarioFinal } from "../../utils/timeUtils";
import dayjs from "dayjs";


const horas = [
     "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
    "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30",
    "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "0:00"
];

function carregarHorarios(horarioFuncionamento, data, updateFieldHandler, agendamentos) {
    if (horarioFuncionamento === "FECHADO") return <p>A arena não funciona neste dia.</p>;
    if (!horarioFuncionamento || !horarioFuncionamento.abertura || !horarioFuncionamento.fechamento) return <p>Carregando horários...</p>;

    const { abertura, fechamento } = horarioFuncionamento;
    console.log("Horario Funcionamento:", horarioFuncionamento);

    const timeToMinutes = (time) => {
        if (!time) return 0;
        if (String(time).includes(':')) {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        }
        return Number(time) * 60;
    };

    let inicioMinutos = timeToMinutes(abertura);
    let fimMinutos = timeToMinutes(fechamento);
    
    if (fimMinutos < inicioMinutos) {
        fimMinutos += 24 * 60; 
    }

    console.log("Inicio (min):", inicioMinutos, "Fim (min):", fimMinutos);

    const horasFiltradas = horas.filter(hora => {
        let horaMinutos = timeToMinutes(hora);
        if (fimMinutos >= 1440) {
             return horaMinutos >= inicioMinutos || horaMinutos <= (fimMinutos - 1440);
        } else {
             return horaMinutos >= inicioMinutos && horaMinutos <= fimMinutos;
        }
    });
    console.log("Horas Filtradas:", horasFiltradas);

    const isConflict = (hora) => {
        const duracaoMin = timeToMinutes(data.duracao || "01:00");
        let inicioMin = timeToMinutes(hora);

        if (fimMinutos >= 1440 && inicioMin < timeToMinutes(abertura)) {
            inicioMin += 1440;
        }

        const fimAgendamento = inicioMin + duracaoMin;

        if (fimAgendamento > fimMinutos) {
            return true;
        }

        if (!Array.isArray(agendamentos) || agendamentos.length === 0) return false;

        return agendamentos.some(agendamento => {
            const agInicio = timeToMinutes(agendamento.inicio);
            const agFim = timeToMinutes(agendamento.fim);
            return inicioMin < agFim && fimAgendamento > agInicio;
        });
    };

    return horasFiltradas.map((element) => {
        const disabled = isConflict(element);
        return (
            <div key={element} className="horario-item">
                <input 
                    className="horarioRadio"
                    type="radio" 
                    value={element} 
                    name="horario" 
                    id={`horario-${element}`}
                    checked={data.horario === element}
                    onChange={(e) => updateFieldHandler("horario", e.target.value)}
                    disabled={disabled}
                />
                <label className="horarioLabel" htmlFor={`horario-${element}`}>{element}</label>
            </div>
        );
    });   
}

const EscolherHorario = ({data, updateFieldHandler, arenaId}) => {
    const [horarioFuncionamento, setHorarioFuncionamento] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        const fetchHorario = async () => {
            console.log("Fetch Horario - ArenaID:", arenaId, "Dia:", data.dia);

            if (!data.dia || !arenaId || arenaId === "undefined") {
                console.warn(" fetchHorario cancelado: dados incompletos.");
                return;
            }

            try {
                const [year, month, day] = data.dia.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                const diaSemana = dateObj.getDay();
                
                console.log("Calculando dia da semana:", { data: data.dia, year, month, day, diaSemana });

                const response = await fetch(`${import.meta.env.VITE_API_URL}/horario/${arenaId}/${diaSemana}`);
                const result = await response.json();
                console.log("Horarios fetched:", result);

                if ((Array.isArray(result) && result.length === 0) || (result.error && result.error === 'Horário não encontrado')) {
                    console.warn("Nenhum horário de funcionamento encontrado para este dia.");
                    setHorarioFuncionamento("FECHADO"); 
                } else {
                    const horario = Array.isArray(result) ? result[0] : result;
                    setHorarioFuncionamento(horario);
                }
            } catch (error) {
                console.error("Erro ao buscar horários:", error);
            }
        };

        fetchHorario();
    }, [data.dia, arenaId]);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            console.log("Fetch Agendamentos - QuadraID:", data.id_quadra, "Dia:", data.dia);

            if (!data.dia || !data.id_quadra || data.id_quadra === "undefined") {
                 console.warn("fetchAgendamentos ignorado: QuadraID ou Dia ausentes.");
                 setAgendamentos([]);
                 return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos/${data.id_quadra}/${data.dia}`);
                
                if (!response.ok) {
                    const errRes = await response.json().catch(() => ({}));
                    console.error("Erro response agendamentos:", errRes);
                    setAgendamentos([]);
                    return;
                }

                const result = await response.json();
                if (Array.isArray(result)) {
                    setAgendamentos(result);
                } else {
                    setAgendamentos([]);
                }
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
                setAgendamentos([]);
            }
        };
        fetchAgendamentos();
    }, [data.dia, data.id_quadra]);


    useEffect(() => {
        if (!data.duracao) {
            updateFieldHandler("duracao", "1.0");
        }
    }, [data.duracao, updateFieldHandler]);

    return (
        <div>
            <div className="form-horario-container">
                <div className="dia-selecionado">
                    {data.dia && <p>Data selecionada: {dayjs(data.dia).format("DD/MM/YYYY")}</p>}
                </div>
                <h4>Qual duração você deseja?</h4>
                <form className="horario-container">
                    <div className="horario-item">
                        <input 
                            className="horarioRadio"
                            type="radio" 
                            name="duracao" 
                            value="1.0" 
                            id="duracao-1"
                            checked={data.duracao === "1.0"} 
                            onChange={(e) => updateFieldHandler("duracao", e.target.value)}
                        />
                        <label className="horarioLabel" htmlFor="duracao-1">1 hora</label>
                    </div>
                    
                    <div className="horario-item">
                        <input 
                            className="horarioRadio"
                            type="radio" 
                            name="duracao" 
                            value="1.5" 
                            id="duracao-1-30"
                            checked={data.duracao === "1.5"} 
                            onChange={(e) => updateFieldHandler("duracao", e.target.value)}
                        />
                        <label className="horarioLabel" htmlFor="duracao-1-30">1h 30min</label>
                    </div>
                    
                    <div className="horario-item">
                        <input 
                            className="horarioRadio"
                            type="radio" 
                            name="duracao" 
                            value="2.0" 
                            id="duracao-2"
                            checked={data.duracao === "2.0"} 
                            onChange={(e) => updateFieldHandler("duracao", e.target.value)}
                        />
                        <label className="horarioLabel" htmlFor="duracao-2">2 horas</label>
                    </div>
                </form>
                <h4>Qual horário você deseja iniciar?</h4>
                <form className="horario-container">
                    {carregarHorarios(horarioFuncionamento, data, updateFieldHandler, agendamentos)}
                </form>
                {data.horario && gerarDadosAgendamento(data)}
            </div>
        </div>
    );
};

const gerarDadosAgendamento = (data) => {
    return(
        <div className="dados-horario-container">
            <div className="dados-horario-item">
                <h4>Horário de início:</h4> 
                <p>{data.horario}</p>
            </div>
            <div className="dados-horario-item">
                <h4>Horário de término: </h4>
                <p>{calcularHorarioFinal(data.horario, data.duracao)}</p>
                {console.log(data)}
            </div>
            <div className="dados-horario-item">
                <h4>Valor total: </h4>
                <p>{data.quadra_valor_hora * data.duracao}</p>
            </div>
        </div>
    )
}

export default EscolherHorario;

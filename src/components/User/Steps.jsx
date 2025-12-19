import React, { useState, useEffect } from "react";
import "./Steps.css";

const svgProximo = [<svg key="proximo" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10C15 12.7614 12.7614 15 10 15Z" fill="#74AC3D"/>
<path d="M5 10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10Z" fill="white"/>
</svg>
];
const svgOk = [<svg key="ok" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10Z" fill="#74AC3D"/>
<path d="M4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10Z" fill="#74AC3D"/>
<path d="M15.5054 6L8.03827 13.4401L5 10.4019" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
];

const Steps = ({currentStep, id_quadra, arenaId}) => {
    const [arena, setArena] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            if (id_quadra) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/quadra/${id_quadra}`);
                    if (!response.ok) throw new Error("Erro ao buscar quadra");
                    const data = await response.json();      
                    const quadraData = Array.isArray(data) ? data[0] : data;
                    setArena(quadraData); 
                } catch (error) {
                    console.error("Erro ao buscar info da quadra:", error);
                }
            } 
            else if (arenaId) {
                 try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/arena/id/${arenaId}`);
                    if (!response.ok) throw new Error("Erro ao buscar arena");
                    const data = await response.json();
                    const arenaData = Array.isArray(data) ? data[0] : data;
                    setArena(arenaData);
                 } catch (e) { console.error("Erro ao buscar info da arena:", e) }
            }
        };

        fetchInfo();
    }, [id_quadra, arenaId]);

    return (
        <div className="steps-wrapper">
            <div className="quadra-info">
                {arena && <h3>{arena.nome}</h3>}
                {arena && <p>{arena.descricao}</p>}
            </div>
            <div className="steps-container">
                <div className={
                        currentStep === 1 ? "active" : "ok"}> 
                    {currentStep === 1 ? svgProximo : svgOk}
                    <p>Escolher data</p>
                </div>
                <div className={
                        currentStep === 2 ? "active" 
                        : currentStep < 2 ? "disabled" 
                        : "ok"}> 
                    {currentStep > 2 ? svgOk : svgProximo}
                    <p>Escolher horário</p>
                </div>
                <div className={
                        currentStep === 3 ? "active" 
                        : currentStep < 3 ? "disabled" 
                        : "ok"}> 
                    {currentStep > 3 ? svgOk : svgProximo}
                    <p>Confirmar agendamento</p>
                </div>
            </div>
        </div>
    );
};

export default Steps;
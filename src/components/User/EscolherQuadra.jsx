import "./EscolherQuadra.css"; 

import { useState, useEffect } from "react";
import "./EscolherQuadra.css"; 

const EscolherQuadra = ({ data, updateFieldHandler, autoadvance, arenaId }) => {
  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuadras = async () => {
      if (!arenaId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/quadra/arena/${arenaId}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar quadras');
        }
        const data = await response.json();
        setQuadras(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuadras();
  }, [arenaId]);

  const handleRadioChange = (e) => {
    updateFieldHandler("id_quadra", e.target.value);
    autoadvance();
  };

  const handleLabelClick = (value) => {
    if (data.id_quadra === value) {
      autoadvance();
    }
  };

  if (loading) return <p>Carregando quadras...</p>;
  if (error) return <p>Erro ao carregar quadras: {error}</p>;

  return (
    <div className="escolher-quadra-container">
      <h2>Selecione a Quadra</h2>

      <div className="quadras-grid">
        {quadras.length > 0 ? (
          quadras.map((quadra) => (
            <div className="quadra-card" key={quadra.id_quadra || quadra.id}>
              <div className="quadra-info">
                <h3>{quadra.nome}</h3>
              </div>
              <button
                className="quadra-button"
                type="button"
                onClick={() => {
                  const idCliente = localStorage.getItem("id_cliente");
                  if (!idCliente) {
                      localStorage.setItem('redirectAfterLogin', window.location.pathname);
                      window.location.href = '/loginUser';
                      return;
                  }
                  
                  const quadraId = quadra.id_quadra;
                  
                  if (!quadraId) {
                      console.error("ID da quadra não encontrado no objeto:", quadra);
                      alert("Erro: ID da quadra não identificado.");
                      return;
                  }

                  updateFieldHandler("id_quadra", quadraId);
                  updateFieldHandler("quadra_valor_hora", quadra.valor_hora);
                  autoadvance();
                }}
              >
                Visualizar horários
              </button>
            </div>
          ))
        ) : (
          <p>Nenhuma quadra encontrada para esta arena.</p>
        )}
      </div>
    </div>
  );
};

export default EscolherQuadra;
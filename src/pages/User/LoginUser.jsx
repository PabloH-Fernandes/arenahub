import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../public/arena-hub.svg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isRegistering 
                ? `${import.meta.env.VITE_API_URL}/cliente/cadastro`
                : `${import.meta.env.VITE_API_URL}/cliente/login`;
            
            const body = isRegistering 
                ? { email, senha: password, nome, telefone }
                : { email, senha: password };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro na solicitação");
            }

            if (isRegistering) {
                alert("Conta criada com sucesso! Faça login.");
                setIsRegistering(false);
            } else {
                console.log("Login successful. Backend response:", data);
                if (data.cliente) {
                    console.log("Saving client ID to localStorage:", data.cliente.id);
                    localStorage.setItem("id_cliente", data.cliente.id);
                    localStorage.setItem("nome_cliente", data.cliente.nome);
                } else {
                    console.error("No client data received from backend!");
                }
                alert("Login realizado com sucesso!");
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin');
                    navigate(redirectPath);
                } else {
                    navigate("/arena/arena-vegas");
                }
            }

        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <img src={logo} alt="Arena Hub" className="logo-img" />
                    <h1 className="logo-text">Arena Hub</h1>
                </div>

                <div className="login-box">
                    <h2>{isRegistering ? "Crie sua conta" : "Entre na sua conta"}</h2>

                    <form className="login-form" onSubmit={handleAuth}>
                        {isRegistering && (
                            <>
                                <div className="input-group">
                                    <label>Nome Completo</label>
                                    <input 
                                        type="text" 
                                        placeholder="Digite seu nome" 
                                        required 
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Telefone</label>
                                    <input 
                                        type="text" 
                                        placeholder="Digite seu telefone" 
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label>E-mail</label>
                            <input 
                                type="email" 
                                placeholder="Insira o seu e-mail" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input 
                                type="password" 
                                placeholder="Insira sua senha" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Carregando..." : isRegistering ? "Cadastrar" : "Entrar"}
                        </button>

                        {!isRegistering && (
                            <a href="#" className="forgot-password">Esqueci a minha senha</a>
                        )}
                    </form>

                    <div className="create-account-container">
                        <button 
                            className="btn-secondary" 
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? "Já tenho uma conta" : "Criar uma nova conta"}
                            <span className="arrow-icon">↗</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
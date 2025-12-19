'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Landmark, SquarePen, CircleUserRound, Menu, X, CalendarCheck } from 'lucide-react';
import './HeaderUser.css';
import logo from '../../public/arena-hub.svg';

const Header = ({ paginaAtual = 'agendar' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <div className={`BarraSuperiorUser ${isScrolled ? 'scrolled' : ''}`}>

        <div className="logo-nav">
          <img src={logo} className="logo" alt="Logo" />
          <h3>Arena Hub</h3>
        </div>

        <div className='container-nav-user'>
          {paginaAtual === 'agendar' ? (
            <div className="intem-nav" onClick={() => window.location.href = '/MeusAgendamentos'}>
              <Calendar size={22} />
              <h3>Meus Agendamentos</h3>
            </div>
          ) : (
            <div className="intem-nav" onClick={_route => window.location.href = '/arena/arena-vegas'}>
              <CalendarCheck size={22} />
              <h3>Agendar</h3>
            </div>
          )}  

          <div className="user-nav">
            {localStorage.getItem('id_cliente') ? (
              <>
                <CircleUserRound size={32} />
                <h3>{localStorage.getItem('nome_cliente') && localStorage.getItem('nome_cliente') !== 'undefined' ? localStorage.getItem('nome_cliente') : 'Cliente'}</h3>
                <X 
                  size={20} 
                  style={{ cursor: 'pointer', marginLeft: '10px' }} 
                  onClick={() => {
                    localStorage.removeItem('id_cliente');
                    localStorage.removeItem('nome_cliente');
                    window.location.reload();
                  }}
                />
              </>
            ) : (
              <div className="login-btn" onClick={() => window.location.href = '/loginUser'} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleUserRound size={32} />
                <h3>Login</h3>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Header;
import React from 'react';
import { HelpCircle } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">GFT</div>
          <div className="header-divider"></div>
          <h1 className="header-title">Totem de Equipamentos TI</h1>
        </div>

        <div className="header-right">
          <button className="help-button">
            <HelpCircle size={18} />
            <span>Precisa de ajuda?</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

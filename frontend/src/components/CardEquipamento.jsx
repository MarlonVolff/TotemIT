import React from 'react';
import { ChevronRight } from 'lucide-react';
import './CardEquipamento.css';

const CardEquipamento = ({ equipamento, onClick }) => {
  const Icon = equipamento.icon;

  return (
    <div
      className="card-equipamento"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="card-icon-wrapper">
        <Icon className="card-icon" size={32} strokeWidth={1.5} />
      </div>

      <div className="card-content">
        <div className="card-nome">{equipamento.nome}</div>
        <div className="card-descricao">{equipamento.descricao}</div>
      </div>

      <div className="card-arrow">
        <ChevronRight size={20} strokeWidth={2} />
      </div>
    </div>
  );
};

export default CardEquipamento;

import React from 'react';
import './CardEquipamento.css';

const CardEquipamento = ({ equipamento, onSelect }) => {
  return (
    <div className="card-equipamento" onClick={() => onSelect(equipamento.nome)}>
      <div className="card-icon">{equipamento.icone}</div>
      <div className="card-nome">{equipamento.nome}</div>
    </div>
  );
};

export default CardEquipamento;

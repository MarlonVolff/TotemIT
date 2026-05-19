import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Totem from './pages/Totem';
import PainelTI from './pages/PainelTI';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Totem />} />
        <Route path="/painel-ti" element={<PainelTI />} />
      </Routes>
    </Router>
  );
}

export default App;

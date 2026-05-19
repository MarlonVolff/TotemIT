import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TotemPage } from './pages/TotemPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/totem" replace />} />
        <Route path="/totem" element={<TotemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

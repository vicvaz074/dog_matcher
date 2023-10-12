import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './views/Login';
import SearchPage from './views/SearchPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function ProtectedRoute({ children }) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  return (
    <Router>
      <div className="App">
        {/* Aquí puedes colocar un header o navbar si lo deseas */}
        
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        
        {/* Aquí puedes colocar un footer si lo deseas */}
      </div>
    </Router>
  );
}

export default App;

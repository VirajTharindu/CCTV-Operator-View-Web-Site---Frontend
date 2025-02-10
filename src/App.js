import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define the Login Route */}
          <Route path="/" element={<Login />} />
          
          {/* Define the Dashboard Route */}
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

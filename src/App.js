import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/login/Login';
import MainPage from './pages/mainPage/MainPage';
import RegisterUser from './pages/register/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
};

export default App;

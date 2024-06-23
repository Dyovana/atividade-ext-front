import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackService from '../../services/common-service';
import Hasher from '../../services/hasher';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const service = new BackService();


  const handleRegister = () =>{
    navigate('/register');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const encoded_password = Hasher.encode(password);

      const response = await service.getUser(email, encoded_password);

      console.log("response", response);

      if (response.status === 200) {
        console.log("OK");
        navigate('/mainPage', { state: response.data});
      } else {
        console.error('Login failed:', response.message);
        alert("Erro ao fazer login")
      }
    } catch (error) {
      switch (error.response?.status) {
        case 404:
          alert('Usuário não encontrado.');
          console.error('User not found:', error);
          break;
        default:
          alert('Erro ao fazer login.');
          console.error('Error during login:', error);
          break;
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Senha
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Entrar
        </button>
      </form>

      <button
          type="button" 
          onClick={handleRegister}
        >
          Cadastrar
      </button>
    </div>
  );
};

export default LoginForm;

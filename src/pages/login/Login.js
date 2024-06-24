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
    <div style={{ margin: '50px', marginBottom: '30px' }}>

      
      <form className="bg-white p-6 mb-8 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', width: '400px' }}>
          <label className="block text-gray-700 m-2" htmlFor="email">
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
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', width: '400px' }}>
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
          style={{ margin: '20px'}}
        >
          Entrar
        </button>
      </form>

      <button
          type="button" 
          onClick={handleRegister}
          style={{ margin: '20px'}}
        >
          Cadastrar
      </button>
    </div>
  );
};

export default LoginForm;

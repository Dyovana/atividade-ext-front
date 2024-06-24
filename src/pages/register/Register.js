import React, { useState } from 'react';
import BackService from '../../services/common-service';
import { useNavigate } from 'react-router-dom';
import Hasher from '../../services/hasher';


const RegisterUser = () => {
  const styleForm = { margin: '10px', display: 'flex', flexDirection: 'column', width: '400px' }
  const service = new BackService();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cpf: '',
    full_name: '',
    phone_number: '',
    city: '',
    address: '',
    email: '',
    password: ''

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formWithEncodedPassword = {
        ...form,
        password: Hasher.encode(form.password)
      };

    const result = await service.insertUser(formWithEncodedPassword);
    if (result.status === 201){
        alert("Sucesso ao inserir usuário");
        navigate('/');
    } else{
        alert("Erro ao tentar inserir usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styleForm}>
      <div style={styleForm}>
        <label htmlFor="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" value={form.cpf} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="full_name">Nome Completo:</label>
        <input type="text" id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="phone_number">Telefone:</label>
        <input type="text" id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="city">Cidade:</label>
        <input type="text" id="city" name="city" value={form.city} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="address">Endereço:</label>
        <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div style={styleForm}>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <button style={{ margin: '10px',}} type="submit">Registrar</button>
    </form>
  );
};

export default RegisterUser;

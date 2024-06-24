import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackService from '../../services/common-service';


const QRCode = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const service = new BackService();


  useEffect(() => {
    const fetchData = async () => {
        const result = await service.getAllInfo(id);
        console.log(result)
        if (result.status === 200){
            setData(result.data);
        } else {
            setData(null);
        }
    };

    fetchData();
    }, []);

  // Componente para exibir as informações do usuário e do dependente
    const UserInfo = ({ user, dependent }) => {
        return (
        <div style={{ margin: '50px'}}>
            <h2>Informações do Responsável</h2>
            <p><strong>Nome Completo:</strong> {user.full_name}</p>
            <p><strong>Telefone para contato:</strong> {user.phone_number}</p>
            <p><strong>Cidade:</strong> {user.city}</p>
            <p><strong>Endereço:</strong> {user.address}</p>

            <h2>Informações do Dependente</h2>
            <p><strong>Nome:</strong> {dependent.name}</p>
            <p><strong>Descrição:</strong> {dependent.description}</p>
        </div>
        );
};

  if (!data) {
    return <div>Ops, parece que algo deu errado...</div>;
  }

  return (
    <div>
      <UserInfo user={data.user} dependent={data.dependent} />
    </div>
  );
};

export default QRCode;


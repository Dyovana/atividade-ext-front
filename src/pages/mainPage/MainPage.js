import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BackService from '../../services/common-service';
import 'react-tabs/style/react-tabs.css';

const MainPage = () => {
    const location = useLocation();
    const initialData = location.state;

    const [formData, setFormData] = useState(initialData);
    const [dependent, setDependent] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [auxDependente, setAuxDependent] = useState();
    const service = new BackService();

    useEffect(() => {
        const fetchData = async () => {
          try {

            setAuxDependent({"name": "", "description": "", "cpf_responsavel": formData.cpf})
            const dependentResult = await service.getDependent(formData.cpf);
            setDependent(dependentResult);
            console.log("dependent", dependentResult);
          } catch (error) {
            console.error('Erro ao buscar dependente:', error);
          }
        };
    
        fetchData();
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDependentChange = (e) => {
        const { name, value } = e.target;
        setDependent({
            ...dependent,
            [name]: value
        });
    };

    const handleAuxDependentChange = (e) => {
        const { name, value } = e.target;
        setAuxDependent({
            ...auxDependente,
            [name]: value
        });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const result = await service.updateUser(formData.cpf, formData);
        if (result.status === 200){
            alert("Sucesso ao atualizar usuário");
        } else{
            alert("Erro ao tentar atualizar usuário");
        }
    };

    const handleDependentUpdate = async (event) => {
        event.preventDefault();
        console.log(dependent)

        const result = await service.updateDependent(formData.cpf, dependent);
        if (result.status === 200){
            alert("Sucesso ao atualizar dependente");
        } else{
            alert("Erro ao tentar atualizar dependente");
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateDependent = () => {
        openModal();
    };

    const handleModalSubmit = async (event) => {
        event.preventDefault();

        const result = await service.insertDependent(auxDependente);
        if (result.status === 201){
            setDependent(auxDependente);
            alert("Sucesso ao inserir dependente");
        } else{
            alert("Erro ao tentar inserir dependente");
        }
        closeModal();
    };

    return (
        <div>
            <h1>Detalhes do Usuário e Dependente</h1>
            <Tabs>
                <TabList>
                    <Tab>Dados do Usuário</Tab>
                    <Tab>Dados do Dependente</Tab>
                    <Tab>QRCode</Tab>
                </TabList>

                <TabPanel>
                        {Object.keys(initialData).map((key) => (
                            <div key={key}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</label>
                                {key === 'email' || key === 'cpf' ? (
                                    <input
                                        type="text"
                                        value={formData[key]}
                                        readOnly
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleUpdate}>Atualizar Dados</button>
                </TabPanel>

                <TabPanel>
                    {dependent ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={dependent.name}
                                onChange={handleDependentChange}
                            />
                            <input
                                type="text"
                                name="description"
                                value={dependent.description}
                                onChange={handleDependentChange}
                            />
                            <button type="button" onClick={handleDependentUpdate}>Atualizar Dados</button>
                        </>
                    ) : (
                        <button type="button" onClick={handleCreateDependent}>Cadastrar Dependente</button>
                    )}
                </TabPanel>


                <TabPanel>
                    Visualizar QRcode - Gerar QRcode
                </TabPanel>
            </Tabs>

            {/* Modal de Cadastro de Dependente */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>Fechar</span>
                        <h2>Cadastrar Dependente</h2>
                        <form onSubmit={handleModalSubmit}>
                            <div>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={auxDependente.name}
                                    onChange={handleAuxDependentChange}
                                />
                            </div>
                            <div>
                                <label>Descrição:</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={auxDependente.description}
                                    onChange={handleAuxDependentChange}
                                />
                            </div>
                            <button type="submit">Cadastrar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;

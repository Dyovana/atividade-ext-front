import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BackService from '../../services/common-service';
import 'react-tabs/style/react-tabs.css';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { description } from '../../constants/constants';


const MainPage = () => {
    const location = useLocation();
    const initialData = location.state;
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialData);
    const [dependent, setDependent] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [auxDependente, setAuxDependent] = useState();
    const service = new BackService();
    const styleMainForm = { margin: '20px', display: 'flex', flexDirection: 'column', width: '400px' }
    const personalData = {
        "cpf": "CPF",
        "full_name": "Nome Completo",
        "phone_number": "Número de Telefone",
        "city": "Cidade",
        "address": "Endereço",
        "email": "E-mail"
    }

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

    const handleQRCode = () => {
        navigate(`/QRcode/${formData.cpf}`);
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


    const QRCodeGenerator = ({ url }) => {

        const downloadQRCode = () => {
            const canvas = document.getElementById("1");
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          };
            

        return (
          <div>
            <h1>QR Code</h1>
            <p>QRcode contendo informações do responsavel e do dependente</p>
            <QRCode value={url} id='1'/>

            <div>
            <button style={{ marginTop: '20px', marginBottom: '30px' }} onClick={downloadQRCode}>Download QR Code</button>
            </div>
          </div>

        );
      };

    return (
        <div style={{ margin: '50px', width: '800px' }}>
            <h1>Detalhes do Usuário e Dependente</h1>
            <Tabs>
                <TabList>
                    <Tab>Dados do Usuário</Tab>
                    <Tab>Dados do Dependente</Tab>
                    <Tab>QRCode</Tab>
                    <Tab>Sobre o Projeto</Tab>
                </TabList>

                <TabPanel>
                        {Object.keys(initialData).map((key) => (
                            <div key={key} style={styleMainForm}>
                                <label>{personalData[key]}:</label>
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
                        <button style={{ margin: '20px' }}type="button" onClick={handleUpdate}>Atualizar Dados</button>
                </TabPanel>

                <TabPanel>
                    {dependent ? (
                        <>
                            <div>
                                <div style={styleMainForm}>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={dependent.name}
                                    onChange={handleDependentChange}
                                />
                                </div>
                                
                                <div style={styleMainForm}>
                                <label>Descrição:</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={dependent.description}
                                    onChange={handleDependentChange}
                                />
                                    
                                </div>
                                
                            </div>
                            <button style={{ margin: '20px'}} type="button" onClick={handleDependentUpdate}>Atualizar Dados</button>

                            
                        </>
                    ) : (
                        <button type="button" onClick={handleCreateDependent}>Cadastrar Dependente</button>
                    )}
                </TabPanel>


                <TabPanel>
                    <QRCodeGenerator url={`${window.location.protocol}//${window.location.host}/QRcode/${formData.cpf}`} />
                    
                    <button type="button" onClick={handleQRCode}>Ver informações QRCode</button>

                </TabPanel>

                <TabPanel>
                    <div style={{ width: '700px', height: '300px',  margin: '20px' }}>
                    {description.description_project}
                    </div>
                </TabPanel>
            </Tabs>

            {/* Modal de Cadastro de Dependente */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span style={styleMainForm} className="close" onClick={closeModal}>Cancelar</span>
                        <h2>Cadastrar Dependente</h2>
                        <form onSubmit={handleModalSubmit}>
                            <div style={styleMainForm}>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={auxDependente.name}
                                    onChange={handleAuxDependentChange}
                                />
                            </div>
                            <div style={styleMainForm}>
                                <label>Descrição:</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={auxDependente.description}
                                    onChange={handleAuxDependentChange}
                                />
                            </div>
                            <button style={{'margin': '20px'}} type="submit">Cadastrar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;

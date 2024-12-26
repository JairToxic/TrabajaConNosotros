"use client";
import styled from "@emotion/styled";
import { FaBriefcase, FaUserPlus } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: row; 
  justify-content: space-evenly;
  align-items: flex-start;
  gap: 20px;
  width: 100%; 

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center; 
  }
`;

const ButtonPerfil = styled.button`
  border-radius: 10px;
  background: #264B8B;
  height: 20%; 
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  border: none;
  font-family: Calibri;
  text-align: center;
  width: 100%; 
  padding: 2%; 
  box-sizing: border-box; 
  transition: transform 0.3s ease; 
  gap:30px;
  padding-right:30px;
  &:hover {
    transform: scale(
      1.05
    ); 
  }

  &:disabled {
    background: #d3d3d3; 
    color: #ffffff; 
    cursor: not-allowed; 
    transform: none; 
  }
`;

const Image = styled.img`
  width: 40%; 
  height: auto; 
  object-fit: cover;
  border-radius:10px;
`;

const Label = styled.span`
  margin-top: 10px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
`;

const Controles = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15px;
  margin: 0 auto; 
`;

const MenuTrabajaConNosotros = () => {
  const handleClick = (url) => {
    window.location.href = url;
  };

  return (
    <Container>
      <Controles id="controles">
        <ButtonPerfil onClick={() => handleClick("/admin/trabaja-con-nosotros/vacantes")}
        >
          <FaBriefcase style={{ color: '#ffffff', paddingLeft: '10px', fontSize: '100px' }}  />
          <Label>Ver vacantes y postulantes</Label>
        </ButtonPerfil>
        <ButtonPerfil onClick={() => handleClick("/admin/trabaja-con-nosotros/vacantes/crear-nuevo")}
        >
          <FaUserPlus style={{ color: '#ffffff', paddingLeft: '10px', fontSize: '100px' }}  />
          <Label>Crear vacante</Label>
        </ButtonPerfil>
      
      </Controles>
    </Container>
  );
};

export default MenuTrabajaConNosotros;
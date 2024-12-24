import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const FloatingPopup = ({ message, buttonText, redirectTo, onClose }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (redirectTo) {
        router.push(redirectTo);
      }
      onClose();
  };

  return (
    <Overlay>
      <PopupContainer>
        <Message>{message}</Message>
        <ConfirmButton onClick={handleButtonClick}>{buttonText}</ConfirmButton>
      </PopupContainer>
    </Overlay>
  );
};

export default FloatingPopup;

// Estilos usando styled-components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
`;

const PopupContainer = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #21498e;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #9bcb3c; /* Color de fondo al pasar el mouse */
  }
`;

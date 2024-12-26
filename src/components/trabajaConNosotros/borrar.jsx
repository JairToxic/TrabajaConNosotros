"use client";
import styled from "@emotion/styled";
import React, {useState, useEffect} from "react";
import { FaUsers, FaUser } from 'react-icons/fa';
 
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 0px;
  width: 100%;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
`;
 
const ButtonCompare = styled.button`
  border-radius: 10px;
  background: #21498e;
  height: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: none;
  font-family: Calibri;
  font-size:20px;
  text-align: center;
  width: 50%;
  padding: 2%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  gap:30px;
  padding-right:30px;
  margin-bottom:10px;
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
 
const Label = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 32px;
  color: #21498e;
  text-align: center;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
`;
 
const Text = styled.span`
  margin-top: 10px;
  font-size: 20px;
  color: #000000;
  text-align: left;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
`;
 
const SmallerText = styled.span`
  margin-top: 10px;
  font-size: 18px;
  color: #000000;
  text-align: left;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
`;
 
const BlueText = styled.span`
  margin-top: 10px;
  font-size: 20px;
  color: #21498e;
  text-align: left;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
`;
 
const Title = styled.h1`
  margin-top: 30px;
  font-size: 40px;
  color: #21498e;
  text-align: center;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
  font-weight: 700;
`;
 
const Subitle = styled.h2`
  margin-top: 30px;
  font-size: 40px;
  color: #21498e;
  text-align: left;
  word-wrap: break-word;
  flex-grow: 1;
  font-family: Calibri;
  font-weight: 700;
`;
 
const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 25vw; /* Space between columns */
  justify-content: space-between;
  width:100%;
 
  @media (max-width: 768px) {
    flex-direction: column; /* Stack columns on mobile */
  }
`;
 
const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
`;
 
const RightColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
`;
 
const CenteredContainer=styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
 
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
 
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1); /* Light gray border */
  border-top: 4px solid #21498e; /* Blue border for the spinner effect */
  border-radius: 50%; /* Circular shape */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
 
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
 
const Divider = styled.hr`
    border: none; /* Remove default border */
    height: 1px; /* Set the height of the line */
    background-color: #ccc; /* Set the color of the line */
    margin: 20px 0; /* Add some vertical spacing */
    width: 100%; /* Full width */
`;
 
 
const PaginaComparativa = ({idComparar}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [aFavor, setAFavor]=useState([])
    const [enContra, setEnContra]=useState([])
 
    return ( isLoading ?
        (
            <CenteredContainer>
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            </CenteredContainer>
        )
        :
        (
            <div>
                <CenteredContainer>
                    <Title>Resultados Comparación</Title>
                    <Label>En base a tu perfil, se ha encontrado lo siguiente:</Label>
                </CenteredContainer>
                <Container>
                    <Subitle>Certificaciones</Subitle>
                    <ColumnContainer>
                        <LeftColumn>
                            <Label>A favor</Label>
                                <Text>No existen campos a favor en certificaciones.</Text> // Display a message if the array is empty
                        </LeftColumn>
                        <RightColumn>
                            <Label>En contra</Label>
                                    <div>
                                        <BlueText>Nombre Certificacoin</BlueText>
                                        <div>
                                        <SmallerText><strong>Código:</strong> 123</SmallerText>
                                        </div>
                                        <div>
                                        <SmallerText><strong>Categoria:</strong> Seguridad</SmallerText>
                                        </div>
                                        <Divider></Divider>
                                    </div>
                        </RightColumn>
                    </ColumnContainer>
                </Container>
            </div>
        )
    );
  };
 
  export default PaginaComparativa;
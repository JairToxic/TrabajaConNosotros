"use client";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <>
      <Container>
        <Content>
          <Title>404</Title>
          <Title>Página no encontrada</Title>
          <Message>
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </Message>
        </Content>
      </Container>
    </>
  );
};

export default NotFoundPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
  text-align: center;
  font-family: "Segoe UI", sans-serif;
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #21498e;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 2rem;
`;

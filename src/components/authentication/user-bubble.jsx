"use client";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { signOut, useSession } from "next-auth/react";
import { getUserByToken } from "@src/services/auth.dao";
import { getEmployeeByUserID } from "@src/services/employee.dao";

// Estilos del contenedor principal de la burbuja
const UserBubbleContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: "Segoe UI";
`;

// Estilos del ícono circular del usuario
const BubbleIcon = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #0070f3;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

// Estilos del menú desplegable
const MenuContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  z-index: 10;
  opacity: 0;
  transform: translateY(-10px);
  animation: slideDown 0.3s forwards;

  @keyframes slideDown {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Estilos para la información del usuario
const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
`;

const UserDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #0070f3;
`;

const UserEmail = styled.span`
  font-size: 14px;
  color: #666;
`;

const UserEmployeeStatus = styled.span`
  font-size: 14px;
  color: #666;
`;

const LogoutContainer = styled.div`
  margin-top: 15px;
`;

const LogoutButton = styled.button`
  background-color: #264b8b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-family: 'Segoe UI';
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4da6ff;
  }
`;

// Arreglo de posiciones permitidas
const ALLOWED_POSITIONS = [11, 22, 34, 35, 40];

const UserBubble = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user?.data?.token) {
        const user = await getUserByToken(session?.user?.data?.token);
        const employee = await getEmployeeByUserID(session, user?.id);
        if (employee?.employee.user) {
          setUserInfo(employee.employee);
        }
      }
    };
    fetchUserInfo();
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "http://51.222.110.107:3001/login" });
  };

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  const ProfileImage = () => {
    const fallbackUrl = "https://peopleconnectpictures.blob.core.windows.net/user-info/user_icon.svg";
    const src = userInfo?.photo_url && isValidUrl(userInfo.photo_url) ? userInfo.photo_url : fallbackUrl;
    return src;
  };

  // Verificar si la posición del usuario está en el arreglo permitido
  const isPositionAllowed = ALLOWED_POSITIONS.includes(userInfo?.id_position);

  return (
    <UserBubbleContainer>
      <BubbleIcon
        src={ProfileImage()}
        alt="User Icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && userInfo?.user && (
        <MenuContainer>
          <UserInfoContainer>
            <UserImage src={ProfileImage()} alt="User Profile" />
            <UserDetailsContainer>
              <UserName>{`${userInfo.user.first_name} ${userInfo.user.last_name}`}</UserName>
              <UserEmail>{userInfo.user.email}</UserEmail>
              <UserEmployeeStatus>
                {userInfo.user.is_employee ? "Empleado" : "No es empleado"}
              </UserEmployeeStatus>
            </UserDetailsContainer>
          </UserInfoContainer>

          {/* Mostrar opción de admin si la posición está permitida */}
          {isPositionAllowed && (
            <LogoutContainer>
              <a
                href="http://51.222.110.107:3101/admin/admin-home"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#264b8b",
                  fontWeight: "600",
                  marginBottom: "10px",
                  textDecoration: "none",
                }}
              >
                Ir a Admin Home
              </a>
            </LogoutContainer>
          )}

          <LogoutContainer>
            <LogoutButton onClick={handleSignOut}>Cerrar sesión</LogoutButton>
          </LogoutContainer>
        </MenuContainer>
      )}
    </UserBubbleContainer>
  );
};

export default UserBubble;

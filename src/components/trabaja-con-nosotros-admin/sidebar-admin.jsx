"use client";
import styled from "@emotion/styled";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const MainLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #1a428a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  z-index: 1000;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-250px)")};
  box-shadow: ${(props) => (props.isOpen ? "4px 0 12px rgba(0, 0, 0, 0.1)" : "none")};

  @media (min-width: 768px) {
    transform: translateX(0); // Always visible on larger screens
    width: ${(props) => (props.isOpen ? "250px" : "250px")}; // Keep the width fixed
  }

  @media (max-width: 768px) {
    overflow-y: auto;
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100vh;
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-100%)")};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1001;

  &:hover {
    color: #ddd;
  }

  @media (min-width: 768px) {
    display: none; // Hide on larger screens
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
  transition: margin-left 0.3s ease-in-out;

  @media (min-width: 768px) {
    margin-left: ${(props) => (props.isSidebarOpen ? "250px" : "0px")}; // Adjusts for sidebar
  }

  @media (max-width: 768px) {
    margin-top: 60px; // For mobile, leaves space for the toggle button
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 40px;

  h3 {
    margin-left: 10px;
    color: #fff;
    font-size: 18px;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => (props.active ? "#fff" : "transparent")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#fff" : "#25488e")};
  }
`;

const ItemText = styled.span`
  margin-left: 10px;
  font-size: 14px;
`;

const LogoutButton = styled.button`
  background-color: #d9d9d9;
  border: none;
  border-radius: 5px;
  color: #000;
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: auto;
  width: 100%;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b5b5b5;
  }

  span {
    margin-left: 10px;
    font-size: 14px;
  }
`;

const MenuTitle = styled.div`
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
`;

const Title = styled.div`
  text-align: center;
  background-color: #d3d3d3;
  color: #000;
  padding: 10px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const ToggleButton = styled.button`
  display: none;
  background-color: #1a428a;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1100;
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #25488e;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;
const SidebarAdmin = ({ config, children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [activePath, setActivePath] = useState(router.pathname);
  const [activeItem, setActiveItem] = useState(config.items.find(item => item.url === activePath)?.name || '');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar starts closed by default

  useEffect(() => {
    setActivePath(pathname);
    const currentItem = config.items.find(item => item.url === pathname);
    setActiveItem(currentItem ? currentItem.name : '');
  }, [pathname]);

  const handleItemClick = (url) => {
    router.push(url);
    setSidebarOpen(false); // Close sidebar after selecting an item on mobile
  };

  return (
    <MainLayout>
      {/* Toggle button for mobile view, hidden when sidebar is open */}
      {!isSidebarOpen && (
        <ToggleButton onClick={() => setSidebarOpen(true)}>
          ☰ Menu
        </ToggleButton>
      )}

      <SidebarContainer isOpen={isSidebarOpen}>
        {/* Close button only visible on small screens */}
        <CloseButton onClick={() => setSidebarOpen(false)}>✖</CloseButton>

        <TopSection>
          <Image src={config.topImageUrl} alt="Admin" width={50} height={50} />
          <h3>{config.topText}</h3>
        </TopSection>
        <MenuTitle>{config.menuTitle}</MenuTitle>
        <ItemList>
          {config.items.map((item) => (
            <Item
              key={item.id}
              active={activePath === item.url}
              onClick={() => handleItemClick(item.url)}
            >
              <Image
                src={item.iconUrl}
                alt={item.name}
                width={20}
                height={20}
              />
              <ItemText>{item.name}</ItemText>
            </Item>
          ))}
        </ItemList>

        <LogoutButton onClick={() => router.push("/logout")}>
          <Image
            src={config.logoutIconUrl}
            alt="Logout"
            width={20}
            height={20}
          />
          <span>Cerrar Sesión</span>
        </LogoutButton>
      </SidebarContainer>

      <Content isSidebarOpen={isSidebarOpen}>
        <Title>{`Editar la configuración de ${activeItem}`}</Title>
        {children}
      </Content>
    </MainLayout>
  );
};

export default SidebarAdmin;
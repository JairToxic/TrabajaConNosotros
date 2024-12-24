"use client";

import React, { createContext, useState, useContext } from "react";

const MyContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [tabsData, setTabsData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [carouselImages, setCarouselImages] = useState(null);
  const [homeImages, setHomeImages] = useState([]); // Estado para las imágenes del home
  const [homeTexts, setHomeTexts] = useState({}); // Nuevo estado para los textos del home

  return (
    <MyContext.Provider
      value={{
        tabsData: tabsData,
        setTabsData: setTabsData,
        tableData: tableData,
        setTableData: setTableData,
        carouselImages: carouselImages,
        setCarouselImages: setCarouselImages,
        homeImages: homeImages, // Estado de imágenes
        setHomeImages: setHomeImages, // Función para actualizar las imágenes
        homeTexts: homeTexts, // Añadir el estado de textos al contexto
        setHomeTexts: setHomeTexts, // Función para actualizar los textos del home
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook para acceder al contexto
export const useAdminContext = () => useContext(MyContext);

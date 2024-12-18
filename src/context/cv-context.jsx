"use client";

import React, { createContext, useState, useContext } from "react";

const MyContext = createContext();

export const CVContextProvider = ({ children }) => {
  const [cvData, setCVData] = useState('');
  return (
    <MyContext.Provider
      value={{
        cvData: cvData,
        setCVData: setCVData,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook para acceder al contexto
export const useCVContext = () => useContext(MyContext);

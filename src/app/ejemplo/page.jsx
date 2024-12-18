'use client'
import React, { useEffect } from "react";
import { useCVContext } from "@/context/cv-context";
const Ejemplo = () => {
  const { cvData, setCVData } = useCVContext();
  useEffect(() => {
    console.log("CV HERE", cvData);
  }, [cvData]);
  return (
    <div>
      <button onClick={() => console.log('Here> ',cvData)}>BUtton</button>
    </div>
  );
};

export default Ejemplo;

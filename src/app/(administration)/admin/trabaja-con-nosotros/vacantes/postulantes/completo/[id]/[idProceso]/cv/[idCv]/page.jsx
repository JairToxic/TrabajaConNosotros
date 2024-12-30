'use client'
import React from 'react';
import { useEffect } from 'react';
import CV from '../../../../../../../../../../../components/cv-word/cv';  // Ajusta esta ruta según sea necesario
import { useParams } from "next/navigation"; 


function Page() {
  const {idCv} =useParams()
  return (
    <div>
      <CV idCV={idCv} /> 
    </div>
  );
}
 
export default Page;
'use client'
import React from 'react';
import CV from '../../../../components/cv-word/cv';  // Ajusta esta ruta según sea necesario
import { useParams } from "next/navigation"; 


function Page() {
  const {id} =useParams()
  return (
    <div>
      <CV idCV={id} /> 
    </div>
  );
}
 
export default Page;
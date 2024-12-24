'use client'
import React from 'react';
import { useParams } from "next/navigation"; 
import Applicants from '../../../../../../../components/trabajaConNosotros/applicants';

function Page() {
  const {id} =useParams()
  return (
    <div>
      <Applicants idProcess={id} /> 
    </div>
  );
}
 
export default Page;
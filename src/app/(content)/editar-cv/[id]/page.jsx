'use client'
import React from 'react'
import CVDetails from '../../../../components/currriculum/CurriculumCompleto'
import { useParams } from "next/navigation"; 

function page() {
  const {id} =useParams()
  return (
    <div>
      <CVDetails applicantData={id}/>
    </div>
  )
}

export default page

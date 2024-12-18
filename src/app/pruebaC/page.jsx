'use client'
import React, { useEffect } from 'react'
import CVDetails from '../components/currriculum/CurriculumCompleto'
import { useCVContext } from '@/context/cv-context'

function page() {
  const {cvData, setCVData} = useCVContext()
  useEffect(() => {
    console.log('CV HERE',cvData)
  },[cvData])
  return (
    <div>
      <CVDetails cv={cvData}/>
    </div>
  )
}

export default page

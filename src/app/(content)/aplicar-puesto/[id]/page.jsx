'use client'

import React from 'react'
import SubirPDF from '../../../../components/subeCV/procesarCV'
import { useParams } from "next/navigation"; 

function page() {
  const {id} =useParams()
  return (
    <div>
        <SubirPDF processId={id}/>
    </div>
  )
}

export default page

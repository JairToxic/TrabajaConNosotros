"use client"
import React from 'react'
import AsistenteInformacion from '../../../../components/VacantePerfil/vacantePerfil'
import { useParams } from 'next/navigation'

function page() {
  const id=useParams()
  return (
    <div>
      <AsistenteInformacion idVacante={id.id}/>
    </div>
  )
}

export default page

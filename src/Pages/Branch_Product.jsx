import React from 'react'
import { useParams } from 'react-router-dom'

export const Branch_Product = () => {
  const { branch_id } = useParams();

  return (
    <div>Branch_Product - {branch_id}</div>
  )
}

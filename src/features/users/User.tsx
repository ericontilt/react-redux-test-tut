import React from 'react'
import { useParams } from 'react-router-dom'

export default function User() {
  const params = useParams()

  return <h2>User {params.userId}</h2>
}

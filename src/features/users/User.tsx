import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectUserById } from './userSlice'

export default function User() {
  const { userId = '' } = useParams()

  const user = useAppSelector((state) => selectUserById(state, userId))

  return user ? (
    <>
      <h2>User: {user.name}</h2>
      <Link to={`edit`}>✏️</Link>
      <Link to={`/users`}>Back to Users</Link>

      <p>Email: {user.email}</p>
    </>
  ) : (
    <h1>User not found</h1>
  )
}

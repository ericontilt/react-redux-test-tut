import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchUsers, selectUsers, selectUsersStatus } from './userSlice'

export default function UserList() {
  const dispatch = useAppDispatch()

  const users = useAppSelector(selectUsers)
  const usersStatus = useAppSelector(selectUsersStatus)
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [usersStatus, dispatch])

  return usersStatus === 'loading' ? (
    <h1>Loading...</h1>
  ) : usersStatus === 'failed' ? (
    <h1>Error</h1>
  ) : (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

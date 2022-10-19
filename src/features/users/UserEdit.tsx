import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectUserById, updateUser } from './userSlice'

export default function UserEdit() {
  const { userId = '' } = useParams()
  const navigate = useNavigate()

  const user = useAppSelector((state) => selectUserById(state, userId))
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [requestStatus, setRequestStatus] = useState('idle')

  const dispatch = useAppDispatch()

  if (!user) {
    return <h1>User not found</h1>
  }

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)
  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)

  const canSave =
    [name, email].every(Boolean) &&
    (name !== user.name || email !== user.email) &&
    requestStatus === 'idle'

  const onSaveUserClicked = () => {
    if (canSave) {
      try {
        setRequestStatus('pending')
        dispatch(updateUser({ id: user.id, name, email })).unwrap()
        setName('')
        setEmail('')
        navigate('/users/' + user.id)
      } catch (error) {
        console.error(error)
      } finally {
        setRequestStatus('idle')
      }
    }
  }

  return (
    <>
      <h2>User: {user.name}</h2>
      <Link to={`/users`}>Back to Users</Link>

      <form>
        <label htmlFor='userName'>Name:</label>
        <input
          type='text'
          id='userName'
          name='name'
          value={name}
          onChange={onNameChanged}
        />

        <label htmlFor='userEmail'>Email:</label>
        <input
          type='text'
          id='userEmail'
          name='email'
          value={email}
          onChange={onEmailChanged}
        />

        <button type='button' onClick={onSaveUserClicked} disabled={!canSave}>
          Save
        </button>
      </form>
    </>
  )
}

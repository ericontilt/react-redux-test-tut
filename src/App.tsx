import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './features/home/Home'
import User from './features/users/User'
import UserList from './features/users/UserList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      { index: true, element: <UserList /> },
      {
        path: 'users',
        element: <UserList />,
      },
      {
        path: 'users/:userId',
        element: <User />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

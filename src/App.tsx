import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './features/home/Home'
import User from './features/users/User'
import UserEdit from './features/users/UserEdit'
import UserList from './features/users/UserList'

export const routeDefinitions = [
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
      {
        path: 'users/:userId/edit',
        element: <UserEdit />,
      },
    ],
  },
]

const router = createBrowserRouter(routeDefinitions)

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

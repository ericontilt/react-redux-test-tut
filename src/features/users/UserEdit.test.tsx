import { PreloadedState } from '@reduxjs/toolkit'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RootState } from '../../app/store'
import { render } from '../../testUtils'
import UserEdit from './UserEdit'

/*
<RouterProvider
router={createMemoryRouter(routeDefinitions, {
  initialEntries: ['/users/32129e95-3356-470d-92d8-bf0ff8d24aff/edit'],
})}
/>,
*/

describe('UserEdit', () => {
  const initialState: PreloadedState<RootState> = {
    user: {
      users: [
        {
          id: '32129e95-3356-470d-92d8-bf0ff8d24aff',
          name: 'Test User',
          email: 'test@email.com',
        },
      ],
      usersStatus: 'idle',
    },
  }

  it('renders message for invalid user id', () => {
    render(
      <MemoryRouter initialEntries={['/users/invalid-user-id/edit']}>
        <Routes>
          <Route path='/users/:userId/edit' element={<UserEdit />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      }
    )
    expect(screen.getByRole('heading')).toHaveTextContent(/not found/i)
  })

  it('renders form with input values', () => {
    render(
      <MemoryRouter
        initialEntries={['/users/32129e95-3356-470d-92d8-bf0ff8d24aff/edit']}
      >
        <Routes>
          <Route path='/users/:userId/edit' element={<UserEdit />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      }
    )
    expect(screen.getByRole('heading')).toHaveTextContent(/test user/i)
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue(
      'Test User'
    )
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue(
      'test@email.com'
    )
  })

  it('updates user details', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter
        initialEntries={['/users/32129e95-3356-470d-92d8-bf0ff8d24aff/edit']}
      >
        <Routes>
          <Route path='/users/:userId/edit' element={<UserEdit />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      }
    )

    const nameInput = screen.getByRole('textbox', { name: /name/i })
    await user.type(nameInput, 'New Name')

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.type(emailInput, 'newname@email.com')

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
    user.click(screen.getByRole('button', { name: /save/i }))
  })
})

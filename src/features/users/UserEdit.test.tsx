import { PreloadedState } from '@reduxjs/toolkit'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { RootState } from '../../app/store'
import { render } from '../../testUtils'
import UserEdit from './UserEdit'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { User } from './userSlice'
import { act } from 'react-dom/test-utils'

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
    render(<UserEdit />, {
      route: '/users/invalid-user-id/edit',
      routePath: '/users/:userId/edit',
      preloadedState: initialState,
    })
    expect(screen.getByRole('heading')).toHaveTextContent(/not found/i)
  })

  it('renders form with input values', () => {
    render(<UserEdit />, {
      route: '/users/32129e95-3356-470d-92d8-bf0ff8d24aff/edit',
      routePath: '/users/:userId/edit',
      preloadedState: initialState,
    })
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

    let updatedUser: User
    server.use(
      rest.put('http://localhost:3001/users/:userId', async (req, res, ctx) => {
        updatedUser = (await req.json()) as User
        return res.once(ctx.json({}))
      })
    )

    render(
      <Routes>
        <Route path='/users/:userId' element={<h1>read view</h1>} />
        <Route path='/users/:userId/edit' element={<UserEdit />} />
      </Routes>,
      {
        route: '/users/32129e95-3356-470d-92d8-bf0ff8d24aff/edit',
        preloadedState: initialState,
      }
    )

    const nameInput = screen.getByRole('textbox', { name: /name/i })
    await user.clear(nameInput)
    await user.type(nameInput, 'New Name')

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.clear(emailInput)
    await user.type(emailInput, 'newname@email.com')

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByRole('heading')).toHaveTextContent(/read view/i)

    act(() => {
      expect(updatedUser).toBeDefined()
      expect(updatedUser).toMatchObject({
        name: 'New Name',
        email: 'newname@email.com',
      })
    })
  })
})

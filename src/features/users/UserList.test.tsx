import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '../../testUtils'
import UserList from './UserList'
import { server as mockApi } from '../../mocks/server'
import { rest } from 'msw'

describe('UserList', () => {
  it('renders initial loading state', () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading')).toHaveTextContent('Loading...')
  })

  it('renders a list of users on successful load', async () => {
    // as an alternative syntax to manually wrapping in a Router, use the testUtils render function 'route' option
    render(<UserList />, { route: '/users' })

    // findByRole is async and will wait for the element to appear (or timeout)
    await screen.findByRole('list')

    // once the list appears, we can assert on its contents
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('displays an error on load fail', async () => {
    // replace the default handler with one that returns a 500 error
    mockApi.use(
      rest.get('http://localhost:3001/users', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ errorMessage: 'Something went wrong' })
        )
      })
    )

    // as an alternative syntax to manually wrapping in a Router, use the testUtils render function 'route' option
    render(<UserList />, { route: '/users' })

    // findByRole is async and will wait for the element to appear (or timeout)
    await screen.findByRole('heading', { name: /error/i })

    // once the list appears, we can assert on its contents
    expect(screen.getByRole('heading')).toHaveTextContent('Error')
  })
})

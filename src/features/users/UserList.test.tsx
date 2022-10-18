import { screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '../../testUtils'
import UserList from './UserList'

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
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    )

    // findByRole is async and will wait for the element to appear (or timeout)
    await screen.findByRole('list')

    // once the list appears, we can assert on its contents
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})

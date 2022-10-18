import React from 'react'
import { screen } from '@testing-library/react'
import { render } from './testUtils'
import App from './App'

test('App renders home page by default', () => {
  render(<App />)

  expect(screen.getByText(/home/i)).toBeInTheDocument()
})

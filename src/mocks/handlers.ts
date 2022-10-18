import { rest } from 'msw'

// This configures a request mocking setup with the given request handlers.
// These handlers are responsible for capturing requests and returning mocked responses.
// Learn more: https://mswjs.io/docs/api/setup-server
export const handlers = [
  // Note that this handler will be invoked across all tests. It is possible to
  // isolate the handler to a specific test as well (see docs).
  rest.get('http://localhost:3001/users', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane.doe@email.com'
        }
      ])  
    )
  })
]
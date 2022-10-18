# How to reproduce

```bash
npx create-react-app redux-test-ex --template redux-typescript
cd redux-test-ex
npm i --save-dev json-server concurrently msw
```

Package 'json-server' will act as a REST endpoint when serving the application locally.
Package 'concurrently' is used in package.json to simultaneously run 'json-server' and serve the application.
Package 'msw' will serve mock data when running tests by intercepting HTTP requests.

Modify package.json start script to concurrently run react app and json-server.

```json
{
  ...
  "start": "concurrently \"react-scripts start\" \"json-server -p 3001 ./db.json\"",
}
```

Conjure up some data.

Install react-router-dom.

```bash
npm i --save react-router-dom
```

Replace App.tsx body with router setup

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Counter } from './features/counter/Counter'
import './App.css'
import { UserList } from './features/users/UserList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Counter />,
  },
  {
    path: '/users',
    element: <UserList />,
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
```

Go ahead and clear app.css and remove logo.svg.

Add features/users/userSlice.ts

```typescript
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface User {
  id: string
  name: string
  email: string
}

export interface UserState {
  users: User[]
  usersStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
}

export const initialState: UserState = {
  users: [],
  usersStatus: 'idle',
}

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await fetch('http://localhost:3001/users')
  const data = await response.json()
  return data
})

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    remove: (state, action: PayloadAction<User>) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id)
    },
    update: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      )
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded'
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersStatus = 'failed'
      })
  },
})

export const selectUsers = (state: RootState) => state.users.users
export const selectUsersStatus = (state: RootState) => state.users.usersStatus

export const { add, remove, update } = userSlice.actions

export default userSlice.reducer
```

Add features/users/UserList.tsx

```typescript
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchUsers, selectUsers, selectUsersStatus } from './userSlice'

export function UserList() {
  const dispatch = useAppDispatch()

  const users = useAppSelector(selectUsers)
  const usersStatus = useAppSelector(selectUsersStatus)
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [usersStatus, dispatch])

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Setting up integration testing (user simulation)

Modify app/store.ts

```typescript
import {
  configureStore,
  ThunkAction,
  Action,
  PreloadedState,
  combineReducers,
} from '@reduxjs/toolkit'
import userReducer from '../features/users/userSlice'

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  user: userReducer,
})

// This function helps to set up the store with the correct types from tests
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
```

Modify app/hooks.ts

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

The main goal is now to use the newly defined render method from testUtils.tsx. The render function overrides the default render function from @testing-library and always wraps components in the required Providers. The render function also provides the option to pass in an initial state.

The simples integration test will now look like this:

```typescript
import { screen } from '@testing-library/react'
import React from 'react'
import { render } from '../../testUtils'
import UserList from './UserList'

describe('UserList', () => {
  it('should render', () => {
    render(<UserList />)
    expect(screen.getByRole('heading')).toHaveTextContent('Users')
  })
})
```

## Integrating MSW

mkdir src/mocks

Create src/mock/handlers.ts

```typescript
import { rest } from 'msw'

export const handlers = [
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
          email: 'jane.doe@email.com',
        },
      ])
    )
  }),
]
```

Create src/mock/server.ts

```typescript
// src/mocks/server.js
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)
```

## References

See https://github.com/typicode/json-server for json-server
See https://reactrouter.com/en/main/start/tutorial for a react-router tutorial
See https://redux.js.org/tutorials/essentials/part-5-async-logic on how to load async data using useEffect from component or on app startup.

See https://redux.js.org/usage/writing-tests for writing redux unit test
See https://testing-library.com/docs/example-react-router/ for guidance on integrating react-router into tests
See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles for a list of ARIA roles to be used with (get|find|query)ByRole testing apis.
See https://mswjs.io/docs/getting-started on setting up Mock Service Worker for HTTP request interception in integration tests

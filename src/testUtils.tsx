import React, { PropsWithChildren } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { AppStore, RootState, setupStore } from './app/store'
import { PreloadedState } from '@reduxjs/toolkit'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

// This function is a wrapper around the render function from RTL. It sets up
// the store and providers that will wrap the component under test.
const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  // This function configures all providers that will wrap the render function
  const AllTheProviders = ({ children }: PropsWithChildren<{}>) => {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    store,
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
  }
}

// re-export everything from RTL
export * from '@testing-library/react'

// override render method with custom render method
export { renderWithProviders as render }

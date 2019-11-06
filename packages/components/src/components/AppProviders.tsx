import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { HelmetProvider } from '../libs/helmet'
import { SafeAreaProvider } from '../libs/safe-area-view'
import { configureStore } from '../redux/store'
import { ColumnFiltersProvider } from './context/ColumnFiltersContext'
import { ColumnFocusProvider } from './context/ColumnFocusContext'
import { ColumnWidthProvider } from './context/ColumnWidthContext'
import { DeepLinkProvider } from './context/DeepLinkContext'
import { AppLayoutProvider } from './context/LayoutContext'
import { ThemeProvider } from './context/ThemeContext'

const { persistor, store } = configureStore()

export interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders(props: AppProvidersProps) {
  return (
    <HelmetProvider>
      <ReduxProvider store={store as any}>
        <PersistGate loading={null} persistor={persistor}>
          <DeepLinkProvider>
            <AppLayoutProvider>
              <ColumnFocusProvider>
                <ColumnWidthProvider>
                  <ColumnFiltersProvider>
                    <ThemeProvider>
                      <SafeAreaProvider>{props.children}</SafeAreaProvider>
                    </ThemeProvider>
                  </ColumnFiltersProvider>
                </ColumnWidthProvider>
              </ColumnFocusProvider>
            </AppLayoutProvider>
          </DeepLinkProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  )
}

import React, { useContext, useEffect, useRef } from 'react'

import { useEmitter } from '../../hooks/use-emitter'
import { useForceRerender } from '../../hooks/use-force-rerender'
import { emitter } from '../../libs/emitter'
import { useReduxStore } from '../../redux/context/ReduxStoreContext'
import * as selectors from '../../redux/selectors'

export interface ColumnFocusProviderProps {
  children?: React.ReactNode
}

export interface ColumnFocusProviderState {
  focusedColumnId: string | null
  focusedColumnIndex: number
}

const defaultValue: ColumnFocusProviderState = {
  focusedColumnId: null,
  focusedColumnIndex: -1,
}
export const ColumnFocusContext = React.createContext<ColumnFocusProviderState>(
  defaultValue,
)

export function ColumnFocusProvider(props: ColumnFocusProviderProps) {
  const forceRerender = useForceRerender()

  const store = useReduxStore()
  const valueRef = useRef<ColumnFocusProviderState>(defaultValue)

  useEffect(() => {
    const state = store.getState()
    const columnIds = selectors.columnIdsSelector(state)

    // force always having a valid column focused
    const focusedColumnIndex =
      columnIds.length &&
      (valueRef.current.focusedColumnIndex >= 0 &&
        valueRef.current.focusedColumnIndex < columnIds.length)
        ? valueRef.current.focusedColumnIndex
        : columnIds.length
        ? 0
        : -1
    const focusedColumnId = columnIds[focusedColumnIndex]

    if (
      valueRef.current.focusedColumnId === focusedColumnId &&
      valueRef.current.focusedColumnIndex === focusedColumnIndex
    )
      return

    valueRef.current = { focusedColumnId, focusedColumnIndex }
    forceRerender()
  }, [valueRef.current.focusedColumnId, valueRef.current.focusedColumnIndex])

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)

      const focusedColumnId = payload.columnId || null
      const focusedColumnIndex =
        columnIds && focusedColumnId
          ? columnIds.findIndex(id => id === focusedColumnId)
          : -1

      if (
        valueRef.current.focusedColumnId === focusedColumnId &&
        valueRef.current.focusedColumnIndex === focusedColumnIndex
      )
        return

      valueRef.current = { focusedColumnId, focusedColumnIndex }
      forceRerender()
    },
    [],
  )

  useEmitter(
    'FOCUS_ON_PREVIOUS_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(
            id => id === (valueRef.current.focusedColumnId || columnIds[0]),
          )
        : -1

      const previousColumnIndex = Math.max(
        0,
        Math.min(focusedColumnIndex - 1, columnIds.length - 1),
      )

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[previousColumnIndex],
        columnIndex: previousColumnIndex,
      })
    },
    [],
  )

  useEmitter(
    'FOCUS_ON_NEXT_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(
            id => id === (valueRef.current.focusedColumnId || columnIds[0]),
          )
        : -1

      const nextColumnIndex = Math.max(
        0,
        Math.min(focusedColumnIndex + 1, columnIds.length - 1),
      )

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[nextColumnIndex],
        columnIndex: nextColumnIndex,
      })
    },
    [],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    payload => {
      if (
        valueRef.current.focusedColumnId === (payload.columnId || null) &&
        valueRef.current.focusedColumnIndex === payload.columnIndex
      )
        return

      valueRef.current = {
        focusedColumnId: payload.columnId || null,
        focusedColumnIndex: payload.columnIndex,
      }
      forceRerender()
    },
    [],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    payload => {
      if (
        valueRef.current.focusedColumnId === (payload.columnId || null) &&
        valueRef.current.focusedColumnIndex === payload.columnIndex
      )
        return

      valueRef.current = {
        focusedColumnId: payload.columnId || null,
        focusedColumnIndex: payload.columnIndex,
      }
      forceRerender()
    },
    [],
  )

  return (
    <ColumnFocusContext.Provider value={valueRef.current}>
      {props.children}
    </ColumnFocusContext.Provider>
  )
}

export const ColumnFocusConsumer = ColumnFocusContext.Consumer

export function useFocusedColumn() {
  return useContext(ColumnFocusContext)
}

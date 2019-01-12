import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { ModalPayloadWithIndex } from '@devhub/core'
import { animated, config, useTransition } from 'react-spring/hooks'
import { SettingsModal } from '../../components/modals/SettingsModal'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { Separator, separatorTickSize } from '../common/Separator'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { AddColumnDetailsModal } from './AddColumnDetailsModal'
import { AddColumnModal } from './AddColumnModal'
import { EnterpriseSetupModal } from './EnterpriseSetupModal'

const SpringAnimatedView = animated(View)

function renderModal(modal: ModalPayloadWithIndex) {
  if (!modal) return null

  analytics.trackModalView(modal.name)

  switch (modal.name) {
    case 'ADD_COLUMN':
      return <AddColumnModal showBackButton={modal.index >= 1} />

    case 'ADD_COLUMN_DETAILS':
      return (
        <AddColumnDetailsModal
          showBackButton={modal.index >= 1}
          {...modal.params}
        />
      )

    case 'SETTINGS':
      return <SettingsModal showBackButton={modal.index >= 1} />

    case 'SETUP_GITHUB_ENTERPRISE':
      return <EnterpriseSetupModal showBackButton={modal.index >= 1} />

    default:
      return null
  }
}

export interface ModalRendererProps {
  renderSeparator?: boolean
}

export function ModalRenderer(props: ModalRendererProps) {
  const { renderSeparator } = props

  const { sizename } = useAppLayout()
  const animatedTheme = useAnimatedTheme()
  const columnWidth = useColumnWidth()

  const modalStack = useReduxState(selectors.modalStack)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  const closeAllModals = useReduxAction(actions.closeAllModals)

  const size = columnWidth + (renderSeparator ? separatorTickSize : 0)

  const overlayTransition = useTransition<boolean, any>({
    native: true,
    reset: true,
    unique: true,
    items: currentOpenedModal ? [true] : [],
    keys: () => 'modal-opacity-overlay',
    config: { ...config.default, duration: 200, precision: 0.01 },
    from: { opacity: 0 },
    enter: { opacity: 0.75 },
    leave: { opacity: 0 },
  })[0]

  const modalTransitions = useTransition<ModalPayloadWithIndex, any>({
    native: true,
    reset: true,
    unique: false,
    items: modalStack,
    keys: item => `modal-stack-${item.name}`,
    ...(sizename === '1-small'
      ? {
          from: item =>
            (item.index === 0 && modalStack.length) ||
            (item.index > 0 && !modalStack.length)
              ? { top: Dimensions.get('window').height, left: 0 }
              : { top: 0, left: size },
          enter: { top: 0, left: 0 },
          update: item =>
            modalStack.length > 1 && item.index !== modalStack.length - 1
              ? { top: 0, left: -50 }
              : { top: 0, left: 0 },
          leave: item =>
            item.index === 0 || !modalStack.length
              ? { top: Dimensions.get('window').height, left: 0 }
              : { top: 0, left: size },
        }
      : {
          from: item =>
            (item.index === 0 && modalStack.length) ||
            (item.index > 0 && !modalStack.length)
              ? { left: -size }
              : { left: size },
          enter: { left: 0 },
          update: item =>
            modalStack.length > 1 && item.index !== modalStack.length - 1
              ? { left: -size / 3 }
              : { left: 0 },

          leave: item =>
            item.index === 0 || !modalStack.length
              ? { left: -size }
              : { left: size },
        }),
  })

  return (
    <>
      {!!overlayTransition && (
        <SpringAnimatedView
          style={{
            ...StyleSheet.absoluteFillObject,
            ...overlayTransition.props,
            zIndex: 500,
          }}
        >
          <TouchableOpacity
            animated
            analyticsAction="close-via-overlay"
            analyticsLabel="modal"
            activeOpacity={1}
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: animatedTheme.backgroundColor,
              zIndex: 500,
              ...Platform.select({ web: { cursor: 'default' } as any }),
            }}
            onPress={() => closeAllModals()}
          />
        </SpringAnimatedView>
      )}

      {!!modalTransitions.length && (
        <SpringAnimatedView
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: size,
            overflow: 'hidden',
            zIndex: 900,
          }}
        >
          {modalTransitions.map(
            ({ key, item, props: { width, ...animatedStyle } }) => (
              <SpringAnimatedView
                key={key}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  flexDirection: 'row',
                  ...animatedStyle,
                  overflow: 'hidden',
                  zIndex: 900 + item.index,
                }}
              >
                {renderModal(item)}

                {!!renderSeparator && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      zIndex: 1000,
                    }}
                  >
                    <Separator thick zIndex={1000} />
                  </View>
                )}
              </SpringAnimatedView>
            ),
          )}
        </SpringAnimatedView>
      )}
    </>
  )
}

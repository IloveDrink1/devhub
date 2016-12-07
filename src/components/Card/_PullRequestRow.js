// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

import Themable from '../hoc/Themable';
import TransparentTextOverlay from '../TransparentTextOverlay';
import UserAvatar from './_UserAvatar';

import {
  avatarWidth,
  renderItemId,
  CardText,
  ContentRow,
  FullView,
  HighlightContainerRow1,
  LeftColumn,
  MainColumn,
  RepositoryContentContainer,
  RightOfScrollableContent,
} from './';

import { contentPadding } from '../../styles/variables';
import type { PullRequest, ThemeObject } from '../../utils/types';

@Themable
export default class extends React.PureComponent {
  props: {
    pullRequest: PullRequest,
    theme?: ThemeObject,
  };

  render() {
    const { pullRequest, theme } = this.props;

    if (!pullRequest) return null;

    const title = (pullRequest.get('title') || '').replace(/[\r\n]/g, ' ').replace('  ', ' ').trim();
    if (!title) return null;

    const {
      number,
      state,
      user,
    } = {
      number: pullRequest.get('number'),
      state: pullRequest.get('state'),
      user: pullRequest.get('user'),
    };

    const { icon, color } = (() => {
      switch (state) {
        case 'closed':
          return { icon: 'git-pull-request', color: theme.red };
        default:
          return { icon: 'git-pull-request', color: theme.green };
      }
    })();

    return (
      <ContentRow narrow>
        <LeftColumn center>
          <UserAvatar url={user.get('avatar_url')} size={avatarWidth / 2} />
        </LeftColumn>

        <MainColumn>
          <HighlightContainerRow1>
            <FullView>
              <TransparentTextOverlay color={theme.base01} size={contentPadding} from="right">
                <RepositoryContentContainer>
                  <CardText numberOfLines={1}>
                    <Icon name={icon} color={color} />&nbsp;
                    {title}
                  </CardText>
                </RepositoryContentContainer>
              </TransparentTextOverlay>
            </FullView>

            <RightOfScrollableContent>
              {renderItemId(number)}
            </RightOfScrollableContent>
          </HighlightContainerRow1>
        </MainColumn>
      </ContentRow>
    );
  }
}

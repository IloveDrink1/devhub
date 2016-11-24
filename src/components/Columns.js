// @flow

import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import Column from './Column';
import { contentPadding } from '../styles/variables';

const margin = 2;

const getWidth = ({ first, last } = {}) => {
  const { width } = Dimensions.get('window');

  // if (first && last) return width;
  // if (first || last) return width - contentPadding - margin;

  return width - (2 * (contentPadding + margin));
};

const StyledScrollView = styled.ScrollView`
  overflow: visible;
`;

const StyledView = styled.View`
  flex: 1;
  width: ${getWidth};
`;

const StyledColumn = styled(Column)`
  flex: 1;
  margin-horizontal: ${margin};
  margin-vertical: ${margin * 2};
  border-radius: 4;
`;

export default ({ data = [], ...props }) => (
  <StyledScrollView
    width={getWidth()}
    loop={false}
    removeClippedSubviews={false}
    contentContainerStyle={{ marginHorizontal: contentPadding + margin }}
    horizontal
    pagingEnabled
    {...props}
  >
    {
      data.map(item => (
        <StyledView key={`column-${item.id}`}>
          <StyledColumn title={item.title} data={item.data} />
        </StyledView>
      ))
    }
  </StyledScrollView>
);

import React from 'react';

import { 
    Container,
    Category,
    Icon
 } from './styles';
 
interface Props {
    title: string
    onPress: () => void
}

const CategorySelectButton: React.FC<Props> = ({title, onPress}) => {
  return (
      <Container activeOpacity={0.7} onPress={onPress}>
        <Category>{title}</Category> 
        <Icon name="chevron-down" /> 
      </Container>
  );
}

export default CategorySelectButton;
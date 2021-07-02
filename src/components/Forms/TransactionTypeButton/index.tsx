import React from 'react';

import { Container, Icon, Title } from './styles';
import { TouchableOpacityProps } from 'react-native'

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

interface Props extends TouchableOpacityProps {
    title: string
    type: 'up' | 'down'
    isActive: boolean
}

const TransactionTypeButton: React.FC<Props> = ({title, type, isActive,...rest}) => {
  return (
    <Container type={type} isActive={isActive} {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>
            {title}
        </Title>
    </Container>
  );
}

export default TransactionTypeButton;
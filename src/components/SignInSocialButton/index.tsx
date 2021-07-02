import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { SvgProps } from 'react-native-svg';

import { 
    Container,
    Button,
    ImageContainer,
    Text,
 } from './styles';

interface Props extends RectButtonProps{
    title: string
    svg: React.FC<SvgProps>
}

const SignInSocialButton: React.FC<Props> = ({title, svg: Svg, ...rest}) => {
  return (
      <Container>
          <Button {...rest}>
              <ImageContainer>
                  <Svg />
              </ImageContainer>

              <Text>
                  {title}
              </Text>
          </Button>
      </Container>
  );
}

export default SignInSocialButton;
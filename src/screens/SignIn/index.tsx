import React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import SignInSocialButton from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
 } from './styles';

const SignIn: React.FC = () => {
  const { signInWithGoogle, signInWithApple } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()

  async function handleSignInWithGoogle(){
    try{
      setIsLoading(true)
      return await signInWithGoogle()
    }catch(error){
        console.log(error)
        Alert.alert('Não foi possivel conectar com a conta google.')
        setIsLoading(false)
    }
  }

  async function handleSignInWithApple(){
    try{
      setIsLoading(true)
      return await signInWithApple()
    }catch(error){
        console.log(error)
        Alert.alert('Não foi possivel conectar com a conta Apple.')
        setIsLoading(false)
    }
  }

  return (
      <Container>
        <Header>
            <TitleWrapper>
                <LogoSvg 
                    width={RFValue(120)}
                    height={RFValue(68)}
                />
                <Title>
                    Controle suas {'\n'} finanças de forma {'\n'} muito mais simples
                </Title>

                <SignInTitle>
                    Faça seu login com {'\n'} uma das contas abaixo
                </SignInTitle>
            </TitleWrapper>
        </Header>
        <Footer>
            <FooterWrapper>
                <SignInSocialButton title="Entrar com Google" onPress={handleSignInWithGoogle} svg={GoogleSvg}/>
                {Platform.OS === 'ios' && (
                  <SignInSocialButton title="Entrar com Apple" onPress={handleSignInWithApple} svg={AppleSvg} />
                )}
            </FooterWrapper>

          {isLoading && <ActivityIndicator size="large" color={theme.colors.shape} />}

        </Footer>
      </Container>
  );
}

export default SignIn;
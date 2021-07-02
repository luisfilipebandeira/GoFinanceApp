import 'react-native-gesture-handler';
import React from 'react';

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import AppLoading from 'expo-app-loading';
import {ThemeProvider} from 'styled-components';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'

import {Routes} from './src/routes'

import { AuthProvider, useAuth } from './src/hooks/auth'

import { StatusBar } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const {isLoadingUserStoraged} = useAuth()

  if(!fontsLoaded || isLoadingUserStoraged){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#5636d3" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
    </ThemeProvider>
  );
}
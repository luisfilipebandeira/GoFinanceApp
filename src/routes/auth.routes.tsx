import React from 'react';

import {createStackNavigator} from '@react-navigation/stack'

import SignIn from '../screens/SignIn'

const {Navigator, Screen} = createStackNavigator()

const AuthRoutes: React.FC = () => {
  return (
    <Navigator headerMode="none">
        <Screen name="signIn" component={SignIn} />
    </Navigator>
  );
}

export default AuthRoutes;
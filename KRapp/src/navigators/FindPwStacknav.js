import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Finduserpw from '../pages/login/account/Finduserpw';
import Findpwcode from '../pages/login/account/Findpwcode';
import ChangePw from '../pages/login/account/Changepw';

const Stack = createStackNavigator();

const FindPwStacknav = () => {
  return (
    <Stack.Navigator initialRouteName="Account">
      <Stack.Screen
        name="PW"
        component={Finduserpw}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PwCode"
        component={Findpwcode}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Changepw"
        component={ChangePw}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default FindPwStacknav;

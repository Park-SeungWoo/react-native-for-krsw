import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../pages/main/Account';
import Setting from '../pages/main/accountStack/Setting';
import SetPrecious from '../pages/main/accountStack/SetPrecious';
import acceptCoupleRequest from '../pages/main/accountStack/setcouple/acceptCoupleRequest';
import waitCoupleReponse from '../pages/main/accountStack/setcouple/waitCoupleResponse';

const Stack = createStackNavigator();

const AccountStacknav = ({route}) => {
  return (
    <Stack.Navigator initialRouteName="Account">
      <Stack.Screen
        name="Account"
        component={Account}
        initialParams={route.params}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        initialParams={route.params}
      />
      <Stack.Screen
        name="SetPrecious"
        component={SetPrecious}
        initialParams={route.params}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Accept"
        component={acceptCoupleRequest}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Wait"
        component={waitCoupleReponse}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStacknav;

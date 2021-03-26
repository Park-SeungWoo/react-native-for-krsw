import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../pages/main/Account';
import Setting from '../pages/main/Setting';

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
    </Stack.Navigator>
  );
};

export default AccountStacknav;

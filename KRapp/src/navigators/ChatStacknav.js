import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chatfront from '../pages/main/Chatfront';

const Stack = createStackNavigator();

const ChatStacknav = ({navigation, route}) => {
  return (
    <Stack.Navigator initialRouteName="Chatfront">
      <Stack.Screen
        name="Chatfront"
        component={Chatfront}
        initialParams={route.params}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStacknav;

import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chat from '../pages/main/Chat';
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
      {/* <Stack.Screen
        name="Chat"
        initialParams={route.params}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}>
        {props => <Chat {...props} />}
      </Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default ChatStacknav;

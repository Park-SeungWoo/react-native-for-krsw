import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../pages/main/Home';
import HomeAlbum from '../pages/main/HomeAlbum';

const Stack = createStackNavigator();

const HomeStacknav = ({navigation, route}) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        initialParams={route.params}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomeAlbum"
        component={HomeAlbum}
        initialParams={route.params}
        options={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStacknav;

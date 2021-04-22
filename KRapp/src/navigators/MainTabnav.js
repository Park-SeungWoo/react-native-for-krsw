import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../pages/main/Home';
import AccountStacknav from './AccountStacknav';
import ChatStacknav from '../navigators/ChatStacknav';
import HomeStacknav from '../navigators/HomeStacknav';

const Tab = createBottomTabNavigator();

const MainTabnav = ({route}) => {
  return (
    <Tab.Navigator
      detachInactiveScreens={true}
      tabBarOptions={{
        keyboardHidesTabBar: false,
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name == 'Homenav') iconName = 'home';
          else if (route.name == 'Accountnav') iconName = 'person';
          else if (route.name == 'Chatroom') iconName = 'chatbubbles';
          else iconName = 'alert';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarVisible:
          getFocusedRouteNameFromRoute(route) == 'SetPrecious' ||
          getFocusedRouteNameFromRoute(route) == 'Accept' ||
          getFocusedRouteNameFromRoute(route) == 'Wait'
            ? false
            : true,
      })}>
      <Tab.Screen name="Homenav" component={HomeStacknav} />
      <Tab.Screen
        name="Chatroom"
        component={ChatStacknav}
        initialParams={route.params.params}
      />
      <Tab.Screen
        name="Accountnav"
        component={AccountStacknav}
        initialParams={route.params.params}
      />
    </Tab.Navigator>
  );
};

export default MainTabnav;

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../pages/main/Home';
import AccountStacknav from './AccountStacknav';
import Chat from '../pages/main/Chat';

const Tab = createBottomTabNavigator();

const MainTabnav = ({route}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name == 'Home') iconName = 'home';
          else if (route.name == 'Accountnav') iconName = 'person';
          else if (route.name == 'Chat') iconName = 'chatbubbles';
          else iconName = 'alert';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarVisible:
          getFocusedRouteNameFromRoute(route) == 'SetPrecious' ? false : true,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Chat"
        component={Chat}
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

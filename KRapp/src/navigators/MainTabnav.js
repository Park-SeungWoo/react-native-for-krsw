import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../pages/main/Home';
import Account from '../pages/main/Account';

const Tab = createBottomTabNavigator();

const MainTabnav = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name == 'Home') iconName = 'home';
          else if (route.name == 'Account') iconName = 'person';
          else iconName = 'alert';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};

export default MainTabnav;

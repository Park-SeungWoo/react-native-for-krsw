import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Finduserid from '../pages/login/account/Finduserid';
import FindPwStacknav from './FindPwStacknav';

const Tab = createBottomTabNavigator();

const FindTabnav = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name == 'ID') iconName = 'lock-closed';
          else if (route.name == 'PWstack') iconName = 'key';
          else iconName = 'alert';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="ID"
        component={Finduserid}
        options={{
          tabBarLabel: 'ID 찾기',
        }}
      />
      <Tab.Screen
        name="PWstack"
        component={FindPwStacknav}
        options={{
          tabBarLabel: 'PW 찾기',
        }}
      />
    </Tab.Navigator>
  );
};

export default FindTabnav;

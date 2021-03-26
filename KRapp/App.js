import 'react-native-gesture-handler';
import React from 'react';
import {Appearance} from 'react-native'; // to detect color scheme (dark or light)
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabnav from './src/navigators/MainTabnav';
import Login from './src/pages/login/Login';
import Register from './src/pages/login/Register';
import Finduserid from './src/pages/login/Finduserid';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer
      theme={Appearance.getColorScheme() === 'dark' ? DarkTheme : DefaultTheme}
      // theme={DarkTheme}
    >
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Finduserid"
          component={Finduserid}
          options={{
            headerTitle: 'ID 찾기',
            headerBackTitle: '로그인',
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerTitle: '회원 가입',
            headerBackTitle: '로그인',
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabnav}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

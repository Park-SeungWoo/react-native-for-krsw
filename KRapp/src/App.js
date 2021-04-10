import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Appearance, Alert} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import MainTabnav from './navigators/MainTabnav';
import Login from './pages/login/Login';
import Register from './pages/login/account/Register';
import FindTabnav from './navigators/FindTabnav';

const Stack = createStackNavigator();

// notification permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
  // check permission
  useEffect(async () => {
    await requestUserPermission();
  });

  // notification in foreground
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  }, []);

  return (
    <NavigationContainer
      theme={Appearance.getColorScheme() === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FindTabnav"
          component={FindTabnav}
          options={{
            headerTitle: 'ID/PW 찾기',
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

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabnav from './navigators/MainTabnav';
import Login from './pages/login/Login';
import Register from './pages/login/account/Register';
import FindTabnav from './navigators/FindTabnav';
import {navigationRef, navigate, gotoSetpre} from './methods/Rootnavigator';

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
      // alert(JSON.stringify(remoteMessage.data));
      const userdata = await AsyncStorage.getItem('@LoginInfo');
      if (userdata != null) {
        const userinfo = JSON.parse(userdata);
        switch (remoteMessage.data.type) {
          case 'requestcouple':
            navigate('Main', {
              screen: 'Accountnav',
              params: {
                screen: 'Accept',
                params: {
                  userdata: userinfo,
                },
              },
            });
            break;
          case 'responsecouple':
            const couple = JSON.stringify(remoteMessage.data.coupledata);
            await AsyncStorage.setItem('@CoupleInfo', couple);
            navigate('Main', {
              screen: 'Home',
              params: {
                userdata: userinfo,
                coupledata: remoteMessage.data.coupledata,
              },
            });
            break;
          case 'rejectcouple':
            gotoSetpre(userdata);
            break;
          default:
            break;
        }
      }
    });
  }, []);

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={
          Appearance.getColorScheme() === 'dark' ? DarkTheme : DefaultTheme
        }>
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
    </>
  );
};

export default App;

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Appearance, Alert} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabnav from './navigators/MainTabnav';
import Login from './pages/login/Login';
import Register from './pages/login/account/Register';
import FindTabnav from './navigators/FindTabnav';
import Chat from './pages/main/Chat';
import {
  navigationRef,
  navigate,
  gotoSetpre,
  goToLogin,
} from './methods/Rootnavigator';

const Stack = createStackNavigator();

// notification permission
async function requestUserPermission() {
  // const authStatus =
  await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}

const App = () => {
  // check permission
  useEffect(async () => {
    await requestUserPermission();
  });

  // const approute = useRoute();

  // notification in foreground
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
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
            await AsyncStorage.setItem(
              '@CoupleInfo',
              remoteMessage.data.coupledata,
            );
            goToLogin();
            break;
          case 'rejectcouple':
            gotoSetpre(userdata);
            break;
          case 'chat':
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
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerTransparent: true,
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';

// notification in background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  notifee.incrementBadgeCount();
});

AppRegistry.registerComponent(appName, () => App);

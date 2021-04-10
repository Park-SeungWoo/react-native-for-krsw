import React, {useEffect} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const SetPrecious = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.txt}>set my darling</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default SetPrecious;

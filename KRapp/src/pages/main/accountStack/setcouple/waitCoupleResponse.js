import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const waitCoupleReponse = ({navigation, route}) => {
  // foreground, background에서 coupleresponse라는 알림을 받으면 home으로 이동

  return (
    <View style={styles.main}>
      <Text style={styles.txt}>settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
  },
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default waitCoupleReponse;

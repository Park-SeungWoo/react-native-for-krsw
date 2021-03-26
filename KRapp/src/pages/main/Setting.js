import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';
// const isDarkmode = false;

const Setting = ({navigation, route}) => {
  const {userdata} = route.params;

  const _logout = () => {
    // logout시 필요한 data들 다 정리하고 나가기
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <View style={styles.main}>
      <Text style={styles.txt} onPress={_logout}>
        settings
      </Text>
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

export default Setting;

import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const acceptCoupleRequest = ({navigation, route}) => {
  // foreground, background에서 알림 받으면 이리로 이동하고, db에 저장된 데이터 가지고 맞으면 relation에 제대로 저장 후 requester에게 알림하고 hone으로 이동, 아니면 데이터 삭제 후 requester에게 알림

  const _logout = async () => {
    // logout시 필요한 data들 다 정리하고 나가기
    await AsyncStorage.removeItem('@LoginInfo');
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

export default acceptCoupleRequest;

import React from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';
// const isDarkmode = false;

const registerID = ({navigation, route}) => {
  const {userdata} = route.params;

  const _submit = async () => {
    // 상대 토큰으로 알림, includes 내 토큰, 내 아이디, 만난 날짜 db에 저장.
    // 로컬 저장소에 @sentcouplerequest => {status: true}로 저장하고 setprecious창에서 상대가 수락하지 않으면 기다리는중 페이지로 navigate하기
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

export default registerID;

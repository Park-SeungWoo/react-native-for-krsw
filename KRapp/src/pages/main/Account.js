import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const isDarkmode = Appearance.getColorScheme() === 'dark';

const Account = ({navigation, route}) => {
  const {
    userdata,
    userdata: {sex},
    coupledata,
  } = route.params;
  const goSetting = () => {
    navigation.navigate('Setting');
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topper}>
        <View style={styles.profileimgv}></View>
        <View>
          <Text>{userdata.name}</Text>
          {coupledata != null ? (
            <Text>
              {coupledata.firstp == userdata.name
                ? coupledata.secondp
                : coupledata.firstp}
            </Text>
          ) : (
            <Text>{`아직 등록된 ${
              sex == 'M' ? '여자친구가' : '남자친구가'
            } 없네요 먼저 등록해주세요!`}</Text>
          )}

          <Text>{userdata.email}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <ScrollView style={styles.bodyscroll}>
          <View style={styles.menus}>
            <Text style={styles.txt}>예약 메시지</Text>
          </View>
          <View style={styles.menus}>
            <Text style={styles.txt} onPress={goSetting}>
              설정
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#2f2f2f' : '#f1f1f1',
  },
  topper: {
    flex: 1,
    borderBottomWidth: 2,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
    backgroundColor: isDarkmode ? '#2f2f2f' : '#f1f1f1',
  },
  profileimgv: {
    width: 74,
    height: 74,
    borderRadius: 50,
    borderWidth: 2,
  },
  body: {
    flex: 9,
    width: '100%',
  },
  bodyscroll: {
    padding: 10,
    paddingHorizontal: 20,
  },
  menus: {
    height: 45,
    borderBottomWidth: 1,
    justifyContent: 'center',
    padding: 10,
  },
  txt: {
    color: isDarkmode ? '#f1f1f1' : 'black',
    fontSize: 25,
  },
});

export default Account;

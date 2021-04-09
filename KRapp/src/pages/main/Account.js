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
          <Text>{'서규리'}</Text>
          {/* <Text>{`아직 등록된 ${
            sex == 'M' ? '여자친구가' : '남자친구가'
          } 없네요 먼저 등록해주세요!`}</Text> */}
          <Text>{userdata.email}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <ScrollView style={styles.bodyscroll}>
          <View style={styles.menus}>
            <Text
              style={styles.txt}
              onPress={() => navigation.navigate('SetPrecious')}>
              set my precious
            </Text>
          </View>
          <View style={styles.menus}>
            <Text style={styles.txt}>reserved message</Text>
          </View>
          <View style={styles.menus}>
            <Text style={styles.txt} onPress={goSetting}>
              go to setting
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

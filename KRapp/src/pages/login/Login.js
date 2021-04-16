import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Appearance,
} from 'react-native';
import {IPADDR} from '../../../env.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isDarkmode = Appearance.getColorScheme() == 'dark';
// const isDarkmode = false;

const Login = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  useEffect(async () => {
    const userinfo = await AsyncStorage.getItem('@LoginInfo');
    // user login data exists
    if (userinfo != null) {
      const userdata = JSON.parse(userinfo);
      const data = await login(userdata.id, userdata.password);
      // login succeed
      if (data.login) {
        const usertoken = await _checkNotificationToken(userdata.id); // check token in firebase server
        if (usertoken != data.userdata.token)
          _saveToken(userdata.id, usertoken);
        const coupleinfo = await AsyncStorage.getItem('@CoupleInfo');
        // check couple data
        if (coupleinfo != null) {
          const coupledata = JSON.parse(coupleinfo);
          navigation.navigate('Main', {
            screen: 'Home',
            params: {
              userdata: data.userdata,
              coupledata: coupledata,
            },
          });
          // couple data doesn't exists
        } else {
          navigation.navigate('Main', {
            screen: 'Accountnav',
            params: {
              screen: 'SetPrecious',
              params: {
                userdata: data.userdata,
              },
            },
          });
        }
        // something went wrong during login
      } else {
        alert('로그인 에러!\n다시 로그인 해주세요!');
      }
    }
  }, []);

  const _checkNotificationToken = async () => {
    const token = await messaging().getToken();
    return token;
  };

  const _saveToken = (id, token) => {
    // sabe to db
    const opt = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: id,
        token: token,
      }),
    };

    fetch(`http://${IPADDR}/token/change`, opt);
  };

  const _gotoRegister = () => {
    navigation.push('Register');
  };

  const _gotoFindid = () => {
    navigation.push('FindTabnav', {
      screen: 'ID',
    });
  };

  const _clickSubmit = async () => {
    // login
    const data = await login(id, pw);

    if (data.login) {
      await AsyncStorage.setItem('@LoginInfo', JSON.stringify(data.userdata));
      const usertoken = await _checkNotificationToken(id); // check token in firebase server
      if (usertoken != data.userdata.token) _saveToken(id, usertoken);

      // check if there is couple data
      const iscouple = await AsyncStorage.getItem('@CoupleInfo');
      if (iscouple != null) {
        const coupledata = JSON.parse(iscouple);
        navigation.navigate('Main', {
          screen: 'Home',
          params: {
            userdata: data.userdata,
            coupledata: coupledata,
          },
        });
      } else {
        navigation.navigate('Main', {
          screen: 'Accountnav',
          params: {
            screen: 'SetPrecious',
            params: {
              userdata: data.userdata,
            },
          },
        });
      }
    } else {
      if (data.iderr) alert('존재하지 않는 아이디입니다.');
      else alert('비밀번호를 다시 한번 확인해주세요.');
    }
  };

  const login = async (id, pw) => {
    // login
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: id,
        pw: pw,
      }),
    };
    return fetch(`http://${IPADDR}/login/validate`, option)
      .then(res => res.json())
      .then(json => {
        return json;
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.topper}>
        <Text>LOGO</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.logintxt}>Log in</Text>
        <KeyboardAvoidingView style={styles.inputs}>
          <TextInput
            style={styles.input}
            placeholder={'ID'}
            placeholderTextColor="#a1a1a1"
            textContentType="nickname"
            value={id}
            onChangeText={txt => {
              setId(txt);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            placeholderTextColor="#a1a1a1"
            textContentType="newPassword"
            secureTextEntry={true}
            value={pw}
            onChangeText={txt => {
              setPw(txt);
            }}
          />
        </KeyboardAvoidingView>
        <View style={styles.additionalbtn}>
          <TouchableOpacity>
            <Text style={styles.register} onPress={_gotoRegister}>
              회원 가입
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.register} onPress={_gotoFindid}>
              ID/PW 찾기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitbtn} onPress={_clickSubmit}>
          <Text>로그인 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  topper: {
    flex: 1,
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
    padding: 10,
  },
  logintxt: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
  inputs: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    width: '70%',
    height: 40,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  additionalbtn: {
    width: '60%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // borderWidth: 1,
  },
  register: {
    fontSize: 15,
    fontWeight: '500',
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
  footer: {
    flex: 1,
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
    alignItems: 'center',
    padding: 10,
  },
  submitbtn: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;

import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

const IPADDR = '172.30.1.1:3000';

const Login = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  let idref = useRef();
  let pwref = useRef();

  const _gotoRegister = () => {
    navigation.push('Register');
  };

  const _clickSubmit = () => {
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
    fetch(`http://${IPADDR}/login/validate`, option)
      .then(res => res.json())
      .then(json => {
        alert(json);
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
            ref={ref => (idref = ref)}
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
            ref={ref => (pwref = ref)}
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
            <Text style={styles.register}>ID/PW 찾기</Text>
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
    backgroundColor: '#afaffa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: '#faafaf',
    padding: 10,
  },
  logintxt: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  footer: {
    flex: 1,
    // backgroundColor: '#affaaf',
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

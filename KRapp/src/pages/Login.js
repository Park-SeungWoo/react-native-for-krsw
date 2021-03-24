import {parse} from '@babel/core';
import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const IPADDR = '172.30.86.77:3000';

const Login = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  let idref = useRef();
  let pwref = useRef();

  const _gotoRegister = () => {
    console.log('reg');
    navigation.push('Register');
  };

  return (
    <View style={styles.main}>
      <View style={styles.logoV}>
        <Text>LOGO</Text>
      </View>
      <View style={styles.inputsV}>
        <Text style={styles.logintxt}>Log in</Text>
        <TextInput
          ref={ref => (idref = ref)}
          style={styles.input}
          placeholder={'ID'}
          value={id}
          onChangeText={txt => {
            setId(txt);
          }}></TextInput>
        <TextInput
          ref={ref => (pwref = ref)}
          style={styles.input}
          placeholder={'Password'}
          value={pw}
          onChangeText={txt => {
            setPw(txt);
          }}></TextInput>
        <Text onPress={_gotoRegister}>회원 가입</Text>
      </View>
      <View style={styles.submitV}>
        <TouchableOpacity style={styles.submitbtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  logoV: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: '#afaffa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputsV: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faafaf',
    padding: 10,
  },
  logintxt: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 20,
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
  submitV: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: '#affaaf',
    alignItems: 'center',
    padding: 10,
  },
  submitbtn: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
});

export default Login;

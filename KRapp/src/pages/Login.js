import {parse} from '@babel/core';
import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const IPADDR = '172.30.1.49:3000';

const Login = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  let idref = useRef();
  let pwref = useRef();

  // go to DB server to check validation
  const _submitClick = () => {
    const option = {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: id,
        pw: pw,
      }),
    };

    fetch(`http://${IPADDR}/userinfo`, option)
      .then(res => res.json())
      .then(json => {
        console.log(json);
      });

    // db연결 하면 서버에서 진행할 것
    // reg = /^((?=.*?[A-Z])|(?=.*?[a-z]))(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    // if (reg.test(pw) == false) {
    //   alert('try again!');
    // } else {
    //   alert(`submit!\nid : ${id}\npw : ${pw}`);
    // }
    // idref.clear();
    // pwref.clear();
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
      </View>
      <View style={styles.submitV}>
        <TouchableOpacity style={styles.submitbtn} onPress={_submitClick} />
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

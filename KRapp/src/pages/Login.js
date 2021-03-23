import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

const Login = ({navigation, route}) => {
  return (
    <View style={styles.main}>
      <View style={styles.logoV}>
        <Text>LOGO</Text>
      </View>
      <View style={styles.inputsV}>
        <Text style={styles.logintxt}>Log in</Text>
        <TextInput style={styles.input} placeholder={'ID'}></TextInput>
        <TextInput style={styles.input} placeholder={'Password'}></TextInput>
      </View>
      <View style={styles.submitV}></View>
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
  },
  inputsV: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faafaf',
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
    justifyContent: 'center',
  },
});

export default Login;

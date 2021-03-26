import React, {useState} from 'react';
import {Appearance, StyleSheet, View, TextInput, Text} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const Finduserid = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const _nameChangeTxt = txt => {
    setName(txt);
  };

  const _emailChangeTxt = txt => {
    var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmail(prev =>
      reg.test(txt)
        ? {...prev, text: txt, status: true}
        : {
            ...prev,
            text: txt,
            status: false,
            errmes: '올바른 이메일 형식을 사용해 주세요.',
          },
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.txt}>ID</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder={'Name'}
          placeholderTextColor="#a1a1a1"
          textContentType="name"
          value={name.text}
          onChangeText={txt => _nameChangeTxt(txt)}
        />
        <TextInput
          style={styles.input}
          placeholder={'E-mail'}
          placeholderTextColor="#a1a1a1"
          textContentType="emailAddress"
          value={email.text}
          onChangeText={txt => _emailChangeTxt(txt)}
          keyboardType="email-address"
        />
      </View>
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
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 9,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '70%',
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#f1f1f1',
  },
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Finduserid;

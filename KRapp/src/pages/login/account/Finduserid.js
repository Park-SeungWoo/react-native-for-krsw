import React, {useState} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {IPADDR} from '../../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';

// 이름이랑 email로 유저 찾아서 email로 아이디 보내주는 방법 사용하기

const Finduserid = ({navigation, route}) => {
  const [name, setName] = useState({text: '', status: false, focused: false});
  const [email, setEmail] = useState({
    text: '',
    status: false,
    focused: false,
    errmes: '메일로 인증코드가 발송됩니다.\n사용가능한 메일 주소를 적어주세요.',
  });

  const _nameChangeTxt = txt => {
    setName(prev =>
      txt.length > 1
        ? {...prev, text: txt, status: true}
        : {...prev, text: txt, status: false},
    );
  };

  const _emailChangeTxt = txt => {
    var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmail(prev =>
      reg.test(txt)
        ? {...prev, text: txt, status: true, errmes: ''}
        : {
            ...prev,
            text: txt,
            status: false,
            errmes: '올바른 이메일 형식을 사용해 주세요.',
          },
    );
  };

  // ///////////submit
  const _submit = () => {
    // check id in my email
    fetch(
      `http://${IPADDR}/find/findid?name=${name.text}&email=${email.text}`,
      {method: 'GET'},
    )
      .then(res => res.json())
      .then(json => {
        if (json) {
          Alert.alert('메일 전송', `${email.text}로 아이디를 확인해주세요.`);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        } else {
          alert('계정이 존재하지 않습니다.\n다시 한번 확인해주세요.');
        }
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.txt}>아이디 찾기</Text>
      </View>
      <View style={styles.body}>
        <View
          style={
            name.focused
              ? name.status
                ? {...styles.inputbox, borderColor: '#3eef8f'}
                : {...styles.inputbox, borderColor: '#ff4a4a'}
              : styles.inputbox
          }>
          <TextInput
            style={styles.input}
            placeholder={'Name'}
            placeholderTextColor="#a1a1a1"
            textContentType="name"
            value={name.text}
            onChangeText={txt => _nameChangeTxt(txt)}
            onFocus={e => setName(prev => ({...prev, focused: true}))}
          />
        </View>
        {name.status ? (
          <View style={styles.idpwinputwrap}>
            <View
              style={
                email.focused
                  ? email.status
                    ? {
                        ...styles.inputbox,
                        borderColor: '#3eef8f',
                        width: '100%',
                      }
                    : {
                        ...styles.inputbox,
                        borderColor: '#ff4a4a',
                        width: '100%',
                      }
                  : {...styles.inputbox, width: '100%'}
              }>
              <TextInput
                style={styles.input}
                placeholder={'E-mail'}
                placeholderTextColor="#a1a1a1"
                textContentType="emailAddress"
                value={email.text}
                onChangeText={txt => _emailChangeTxt(txt)}
                onFocus={e => setEmail(prev => ({...prev, focused: true}))}
                keyboardType="email-address"
              />
            </View>
            {email.focused ? (
              email.status ? null : (
                <Text style={styles.idpwstatustxt}>{email.errmes}</Text>
              )
            ) : null}
          </View>
        ) : null}
        {name.status && email.status ? (
          <TouchableOpacity style={styles.submitbtn} onPress={_submit}>
            <Text>아이디 확인하기</Text>
          </TouchableOpacity>
        ) : null}
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
  idpwinputwrap: {
    width: '70%',
  },
  inputbox: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: '100%',
    padding: 10,
    borderRadius: 10,
  },
  submitbtn: {
    width: '70%',
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#3eef8f',
  },
  idpwstatustxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff4a4a',
    marginHorizontal: 12,
  },
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Finduserid;

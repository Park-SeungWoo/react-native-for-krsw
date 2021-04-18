import React, {useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {IPADDR} from '../../../../env.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const ChangePw = ({navigation, route}) => {
  const {email} = route.params;
  const [pw, setPw] = useState({
    text: '',
    status: false,
    focused: false,
    errmes: '8자 이상 알파벳 대/소문자, 숫자, 특수문자를 포함하여 설정해주세요',
  });
  const [pwchk, setPwchk] = useState({
    text: '',
    status: false,
    focused: false,
    errmes: '비밀번호가 일치하지 않습니다.',
  });

  // //////////on hange txt
  const _pwChangeTxt = txt => {
    // 비밀번호 보안 규정 검사
    reg = /^((?=.*?[A-Z])|(?=.*?[a-z]))(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    setPw(prev =>
      reg.test(txt)
        ? {...prev, text: txt, status: true, errmes: ''}
        : {
            ...prev,
            text: txt,
            status: false,
            errmes:
              '8자 이상 알파벳 대/소문자, 숫자, 특수문자를 포함하여 설정해주세요',
          },
    );
  };

  const _pwchkChangeTxt = txt => {
    setPwchk(prev =>
      pw.text == txt && txt != ''
        ? {
            ...prev,
            text: txt,
            status: true,
            errmes: '',
          }
        : {
            ...prev,
            text: txt,
            status: false,
            errmes: '비밀번호가 일치하지 않습니다.',
          },
    );
  };

  // //////////////submit
  const _submitChangedPw = () => {
    const option = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        email: email,
        pw: pw.text,
      }),
    };
    fetch(`http://${IPADDR}/find/changepw`, option)
      .then(res => res.json())
      .then(json => {
        if (json.access) {
          Alert.alert('성공', `비밀번호가 ${pw.text}로 변경되었습니다.`);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        } else {
          alert(
            '비밀번호 변경에 실패하였습니다.\n다시 시도하거나 문제가 반복되면 개발자에게 연락을 해주십시오.',
          );
        }
      })
      .catch(err => {
        alert('네트워크 에러! 다시 시도해주세요!');
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.body}>
        <Text style={styles.txt}>비밀번호 변경하기</Text>
        <View style={styles.idpwinputwrap}>
          <View
            style={
              pw.focused
                ? pw.status
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
              placeholder={'Password'}
              placeholderTextColor="#a1a1a1"
              textContentType="newPassword"
              secureTextEntry={true}
              value={pw.text}
              clearTextOnFocus={false}
              onChangeText={txt => _pwChangeTxt(txt)}
              onFocus={e => setPw(prev => ({...prev, focused: true}))}
            />
            {pw.focused ? (
              pw.status ? (
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  style={{right: 10}}
                  color="#3eef8f"
                />
              ) : (
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={25}
                  style={{right: 10}}
                  color="#ff4a4a"
                />
              )
            ) : null}
          </View>
          {pw.focused ? (
            pw.status ? null : (
              <Text style={styles.idpwstatustxt}>{pw.errmes}</Text>
            )
          ) : null}
        </View>
        <View style={styles.idpwinputwrap}>
          <View
            style={
              pwchk.focused
                ? pwchk.status
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
              placeholder={'Check password'}
              placeholderTextColor="#a1a1a1"
              textContentType="newPassword"
              secureTextEntry={true}
              editable={pw.status} // if password.status is true editable is false
              value={pwchk.text}
              onChangeText={txt => _pwchkChangeTxt(txt)}
              onFocus={e => {
                setPwchk(prev => ({...prev, focused: true}));
              }}
            />
            {pwchk.focused ? (
              pwchk.status ? (
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  style={{right: 10}}
                  color="#3eef8f"
                />
              ) : (
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={25}
                  style={{right: 10}}
                  color="#ff4a4a"
                />
              )
            ) : null}
          </View>
          {pwchk.focused ? (
            pwchk.status ? null : (
              <Text style={styles.idpwstatustxt}>{pwchk.errmes}</Text>
            )
          ) : null}
        </View>
        {pw.status && pwchk.status ? (
          <TouchableOpacity style={styles.submitbtn} onPress={_submitChangedPw}>
            <Text>비밀번호 변경하기</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
  },
  body: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputbox: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    height: 44,
    backgroundColor: '#f1f1f1',
  },
  input: {
    width: '85%',
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  idpwinputwrap: {
    width: '70%',
    margin: 10,
  },
  idpwstatustxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff4a4a',
    marginHorizontal: 12,
    marginTop: 5,
  },
  submitbtn: {
    width: '70%',
    height: 50,
    borderWidth: 2,
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#3eef8f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: isDarkmode ? '#f1f1f1' : 'black',
    fontSize: 20,
    margin: 20,
  },
});

export default ChangePw;

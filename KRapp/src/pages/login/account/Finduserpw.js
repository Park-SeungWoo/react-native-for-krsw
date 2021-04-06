import React, {useState} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {IPADDR} from '../../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';
// const isDarkmode = false;

const Finduserpw = ({navigation, route}) => {
  const [email, setEmail] = useState({
    text: '',
    status: false,
    focused: false,
    errmes: '메일로 인증코드가 발송됩니다.\n사용가능한 메일 주소를 적어주세요.',
  });
  const [id, setID] = useState({
    text: '',
    status: false,
    focused: false,
    mes: 'id를 입력해주세요',
  });

  const _emailChangeTxt = txt => {
    if (txt.length == 0) {
      setEmail(prev => ({
        ...prev,
        text: txt,
        status: false,
        errmes:
          '메일로 인증코드가 발송됩니다.\n사용가능한 메일 주소를 적어주세요.',
      }));
    } else {
      setEmail(prev => ({...prev, text: txt}));
      const option = {
        method: 'GET',
      };
      fetch(`http://${IPADDR}/find/valemail?id=${id.text}&email=${txt}`, option)
        .then(res => res.json())
        .then(json => {
          if (json.access) {
            setEmail(prev => ({
              ...prev,
              status: true,
              errmes: json.mes,
            }));
          } else {
            setEmail(prev => ({
              ...prev,
              status: false,
              errmes: json.mes,
            }));
          }
        });
    }
  };

  const _idChangeTxt = txt => {
    setID(prev => ({...prev, text: txt}));
    // 서버에서 ID유무 검사
    const option = {
      method: 'GET',
    };
    fetch(`http://${IPADDR}/find/idexist?id=${txt}`, option)
      .then(res => res.json())
      .then(json => {
        if (json.access) {
          setID(prev => ({...prev, mes: json.username, status: true}));
        } else {
          setID(prev => ({...prev, mes: json.errmes, status: false}));
        }
      });
  };

  // submit
  const _submitClick = () => {
    // send datas to server to get verification code
    const option = {
      method: 'GET',
    };
    fetch(
      `http://${IPADDR}/find/getcode?email=${email.text}&id=${id.text}`,
      option,
    );
    navigation.push('PwCode', {email: email.text, id: id.text});
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.txt}>PW</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.idpwinputwrap}>
          <View
            style={
              id.focused
                ? id.status
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
              placeholder={'ID'}
              placeholderTextColor="#a1a1a1"
              textContentType="nickname"
              value={id.text}
              onChangeText={txt => _idChangeTxt(txt)}
              onFocus={e => setID(prev => ({...prev, focused: true}))}
            />
          </View>
          {id.focused ? (
            id.status ? (
              <Text style={{...styles.idpwstatustxt, color: '#3eef8f'}}>
                {id.mes}님 안녕하십니까.
              </Text>
            ) : (
              <Text style={styles.idpwstatustxt}>{id.mes}</Text>
            )
          ) : null}
        </View>
        {id.status ? (
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
              email.status ? (
                <Text style={{...styles.idpwstatustxt, color: '#3eef8f'}}>
                  {email.errmes}
                </Text>
              ) : (
                <Text style={styles.idpwstatustxt}>{email.errmes}</Text>
              )
            ) : null}
          </View>
        ) : null}
        {id.status && email.status ? (
          <TouchableOpacity style={styles.submitbtn} onPress={_submitClick}>
            <Text>인증 코드 받기</Text>
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
  inputbox: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    height: 44,
    backgroundColor: '#f1f1f1',
    marginVertical: 10,
  },
  input: {
    width: '85%',
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  idpwinputwrap: {
    width: '70%',
  },
  idpwstatustxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff4a4a',
    marginHorizontal: 12,
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
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Finduserpw;

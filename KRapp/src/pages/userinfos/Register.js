import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IPADDR = '172.30.1.28:3000';

const BSheetcomp = () => {
  return (
    <View
      style={{
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        height: 500,
        width: '100%',
        zIndex: 1,
      }}>
      <Text>hello this is bottom sheet</Text>
    </View>
  );
};

const Register = () => {
  const [name, setName] = useState({text: '', status: false, focused: false});
  const [phnum, setPhnum] = useState({text: '', status: false, focused: false});
  const [date, setDate] = useState(new Date());
  const [id, setID] = useState({text: '', status: false, focused: false});
  const [pw, setPw] = useState({text: '', status: false, focused: false});
  const [pwchk, setPwchk] = useState({text: '', status: false, focused: false});

  ////////////////////////////
  // onChangeText functions //
  ////////////////////////////
  const _nameChangeTxt = txt => {
    setName(prev =>
      txt.length > 1
        ? {...prev, text: txt, status: true}
        : {...prev, text: txt, status: false},
    );
  };

  const _phnumChangeTxt = txt => {
    if (
      (txt.replaceAll('-', '').length == 3 &&
        phnum.text.replaceAll('-', '').length == 2) ||
      (txt.replaceAll('-', '').length == 7 &&
        phnum.text.replaceAll('-', '').length == 6)
    ) {
      txt += '-';
    } else if (
      (txt.replaceAll('-', '').length == 3 &&
        phnum.text.replaceAll('-', '').length == 4) ||
      (txt.replaceAll('-', '').length == 7 &&
        phnum.text.replaceAll('-', '').length == 8)
    ) {
      txt = txt.slice(0, -1);
    }

    // validate
    reg = /^\d{3}-\d{4}-\d{4}$/;
    if (reg.test(txt)) {
      setPhnum(prev => ({...prev, text: txt, status: true}));
    } else {
      setPhnum(prev => ({...prev, text: txt, status: false}));
    }
  };

  const _idChangeTxt = txt => {
    // 서버에서 중복 검사
    setID(prev => ({...prev, text: txt, status: true}));
  };

  const _pwChangeTxt = txt => {
    // 비밀번호 보안 규정 검사
    reg = /^((?=.*?[A-Z])|(?=.*?[a-z]))(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
    setPw(prev =>
      reg.test(txt)
        ? {...prev, text: txt, status: true}
        : {...prev, text: txt, status: false},
    );
  };

  const _pwchkChangeTxt = txt => {
    console.log(pw);
    console.log(txt);
    setPwchk(prev =>
      pw.text == txt
        ? {
            ...prev,
            text: txt,
            status: true,
          }
        : {
            ...prev,
            text: txt,
            status: false,
          },
    );
  };

  ////////////
  // submit //
  ////////////
  const _submitClick = () => {
    if (name.status && phnum.status && id.status && pw.status && pwchk.status) {
      // send datas to server to add user
      const option = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          name: name.text,
          phnum: phnum.text,
          bdate: date,
          id: id.text,
          pw: pw.text,
        }),
      };
      fetch(`http://${IPADDR}/register/add`, option)
        .then(res => res.json())
        .then(json => {
          console.log(json);
        });
    } else {
      alert('입력란을 확인해 주십시오');
      return;
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.topper}>
        <Text style={styles.toppertxt}>회원 가입</Text>
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
          {name.focused ? (
            name.status ? (
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
        <View
          style={
            phnum.focused
              ? phnum.status
                ? {...styles.inputbox, borderColor: '#3eef8f'}
                : {...styles.inputbox, borderColor: '#ff4a4a'}
              : styles.inputbox
          }>
          <TextInput
            style={styles.input}
            placeholder={'Phone number'}
            placeholderTextColor="#a1a1a1"
            textContentType="telephoneNumber"
            keyboardType="number-pad"
            maxLength={13}
            value={phnum.text}
            onChangeText={txt => _phnumChangeTxt(txt)}
            onFocus={e => setPhnum(prev => ({...prev, focused: true}))}
          />
          {phnum.focused ? (
            phnum.status ? (
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
        <View style={styles.birthinputv}>
          {/* <DateTimePicker
            style={{width: 500, height: 50}}
            value={date}
            mode={'date'}
            display="default"
            onChange={(e, d) => {
              setDate(d);
            }}
          /> */}
          <Text style={styles.dates}>
            {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
          </Text>
          <TouchableOpacity
            style={styles.datebtn}
            onPress={() => {
              console.log('open');
            }}>
            <MaterialCommunityIcons name="calendar-heart" size={25} />
          </TouchableOpacity>
        </View>
        <View
          style={
            id.focused
              ? id.status
                ? {...styles.inputbox, borderColor: '#3eef8f'}
                : {...styles.inputbox, borderColor: '#ff4a4a'}
              : styles.inputbox
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
          {id.focused ? (
            id.status ? (
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
        <View
          style={
            pw.focused
              ? pw.status
                ? {...styles.inputbox, borderColor: '#3eef8f'}
                : {...styles.inputbox, borderColor: '#ff4a4a'}
              : styles.inputbox
          }>
          <TextInput
            style={styles.input}
            placeholder={'PW (alpha, num, special char ≧ 8)'}
            placeholderTextColor="#a1a1a1"
            textContentType="password"
            secureTextEntry={true}
            value={pw.text}
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
        <View
          style={
            pwchk.focused
              ? pwchk.status
                ? {...styles.inputbox, borderColor: '#3eef8f'}
                : {...styles.inputbox, borderColor: '#ff4a4a'}
              : styles.inputbox
          }>
          <TextInput
            style={styles.input}
            placeholder={'Check password'}
            placeholderTextColor="#a1a1a1"
            secureTextEntry={true}
            value={pwchk.text}
            onChangeText={txt => _pwchkChangeTxt(txt)}
            onFocus={e => setPwchk(prev => ({...prev, focused: true}))}
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
      </View>
      <View style={styles.footer}>
        {name.status &&
        phnum.status &&
        id.status &&
        pw.status &&
        pwchk.status ? (
          <TouchableOpacity style={styles.submitbtn} onPress={_submitClick}>
            <Text>회원 가입</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{...styles.submitbtn, backgroundColor: '#8f8f8f'}}
            disabled={true}>
            <Text>회원 가입</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* date bottom sheet */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  topper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
  },
  toppertxt: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  body: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    // borderWidth: 1,
  },
  inputbox: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
  },
  input: {
    width: '85%',
    height: 40,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  birthinputv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
  },
  dates: {
    margin: 10,
    fontSize: 18,
  },
  datebtn: {
    width: 25,
    height: 25,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 2,
    alignItems: 'center',
    // borderWidth: 1,
  },
  submitbtn: {
    width: '70%',
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#3eef8f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Register;

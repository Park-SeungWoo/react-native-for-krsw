import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Appearance,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from 'reanimated-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IPADDR} from '../../../../env.json';

const pheight = Dimensions.get('window').height;
const isDarkmode = Appearance.getColorScheme() == 'dark';
// const isDarkmode = true;

const Register = ({navigation, route}) => {
  const [name, setName] = useState({text: '', status: false, focused: false});
  const [sex, setSex] = useState('');
  const [phnum, setPhnum] = useState({text: '', status: false, focused: false});
  const [date, setDate] = useState({
    date: new Date(),
    status: false,
    focused: false,
  });
  const [email, setEmail] = useState({
    test: '',
    status: false,
    focused: false,
    errmes: '비밀번호 찾기에 사용됩니다.\n사용가능한 메일 주소를 적어주세요.',
  });
  const [id, setID] = useState({
    text: '',
    status: false,
    focused: false,
    errmes: 'id를 입력해주세요',
  });
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

  const BSref = useRef(); // for bottom sheet
  // bottom sheet component
  const BSheetcomp = () => {
    return (
      <View
        style={{
          backgroundColor: '#111111dd',
          justifyContent: 'flex-start',
          height: 300,
          // borderWidth: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        {/* header */}
        <View
          style={{
            height: 18,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
            width: '100%',
            backgroundColor: '#121212',
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 5,
              width: 40,
              borderRadius: 10,
              backgroundColor: '#eee',
            }}
          />
        </View>
        {/* body */}
        <DateTimePicker
          style={{margin: 20}}
          value={date.date}
          mode={'date'}
          display="spinner"
          textColor="white"
          onChange={(e, d) => _dateChanged(d)}
        />
      </View>
    );
  };

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

  const _sexChange = sex => {
    setSex(sex);
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

  const _dateChanged = date => {
    setDate(prev =>
      date.getFullYear() <= 2020
        ? {...prev, date: date, status: true}
        : {...prev, date: date, status: false},
    );
  };

  const _emailChangeTxt = txt => {
    var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmail(prev =>
      txt.length != 0
        ? reg.test(txt)
          ? {...prev, text: txt, status: true}
          : {
              ...prev,
              text: txt,
              status: false,
              errmes: '올바른 이메일 형식을 사용해 주세요.',
            }
        : {
            ...prev,
            text: txt,
            status: false,
            errmes:
              '비밀번호 찾기에 사용됩니다.\n사용가능한 메일 주소를 적어주세요.',
          },
    );
  };

  const _idChangeTxt = txt => {
    setID(prev => ({...prev, text: txt}));
    // 서버에서 중복 검사
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: txt,
      }),
    };
    fetch(`http://${IPADDR}/register/dupChk`, option)
      .then(res => res.json())
      .then(json => {
        if (json.access) {
          setID(prev => ({...prev, status: true}));
        } else {
          setID(prev => ({...prev, status: false, errmes: json.err}));
        }
      });
  };

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

  ////////////
  // submit //
  ////////////
  const _submitClick = () => {
    // send datas to server to add user
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        name: name.text,
        sex: sex,
        phnum: phnum.text,
        bdate: date.date,
        email: email.text,
        id: id.text,
        pw: pw.text,
      }),
    };
    fetch(`http://${IPADDR}/register/add`, option)
      .then(res => res.json())
      .then(json => {
        if (json.access) {
          alert('계정 생성 성공!');
          navigation.goBack();
        } else alert('계정 생성 실패!');
      });
  };

  return (
    <View style={styles.main}>
      <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={45}>
        <View style={styles.topper}>
          <Text style={styles.toppertxt}>회원 가입</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            BSref.current.snapTo(0);
          }}>
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
              style={{
                ...styles.inputboxwrap,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableWithoutFeedback onPress={() => _sexChange('M')}>
                <View
                  style={
                    sex == 'M'
                      ? {...styles.sexbtn, borderColor: '#3e8fef'}
                      : {...styles.sexbtn, borderColor: '#b1b1b1'}
                  }>
                  <MaterialCommunityIcons
                    name="gender-male"
                    size={25}
                    color={sex == 'M' ? '#3e8fef' : '#b1b1b1'}
                  />
                  <Text
                    style={
                      sex == 'M'
                        ? {...styles.sextxt, color: '#3e8fef'}
                        : styles.sextxt
                    }>
                    남자
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => _sexChange('W')}>
                <View
                  style={
                    sex == 'W'
                      ? {...styles.sexbtn, borderColor: '#ef8f8f'}
                      : {...styles.sexbtn, borderColor: '#b1b1b1'}
                  }>
                  <MaterialCommunityIcons
                    name="gender-female"
                    size={25}
                    color={sex == 'W' ? '#ef8f8f' : '#b1b1b1'}
                  />
                  <Text
                    style={
                      sex == 'W'
                        ? {...styles.sextxt, color: '#ef8f8f'}
                        : styles.sextxt
                    }>
                    여자
                  </Text>
                </View>
              </TouchableWithoutFeedback>
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
            <View
              style={
                date.focused
                  ? date.status
                    ? {...styles.birthinputv, borderColor: '#3eef8f'}
                    : {...styles.birthinputv, borderColor: '#ff4a4a'}
                  : styles.birthinputv
              }>
              <Text style={styles.dates}>
                {date.date.getFullYear()}-{date.date.getMonth() + 1}-
                {date.date.getDate()}
              </Text>
              <TouchableOpacity
                style={styles.datebtn}
                onPress={() => {
                  setDate(prev => ({...prev, focused: true}));
                  Keyboard.dismiss();
                  BSref.current.snapTo(2);
                }}>
                <MaterialCommunityIcons
                  name="calendar-heart"
                  size={25}
                  color={
                    date.focused
                      ? date.status
                        ? '#3eef8f'
                        : '#ff4a4a'
                      : 'black'
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputboxwrap}>
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
                {email.focused ? (
                  email.status ? (
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
              {email.focused ? (
                email.status ? null : (
                  <Text style={styles.idpwstatustxt}>{email.errmes}</Text>
                )
              ) : null}
            </View>
            <View style={styles.inputboxwrap}>
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
              {id.focused ? (
                id.status ? null : (
                  <Text style={styles.idpwstatustxt}>{id.errmes}</Text>
                )
              ) : null}
            </View>
            <View style={styles.inputboxwrap}>
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
            <View style={styles.inputboxwrap}>
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
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.footer}>
          {name.status &&
          sex != '' &&
          phnum.status &&
          date.status &&
          email.status &&
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
      </KeyboardAwareScrollView>
      {/* date bottom sheet */}
      <BottomSheet
        ref={BSref}
        snapPoints={[0, 0, 350]}
        borderRadius={10}
        renderContent={BSheetcomp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: pheight,
  },
  topper: {
    flex: 1,
    height: pheight / 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
  },
  toppertxt: {
    fontSize: 35,
    fontWeight: 'bold',
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
  body: {
    height: (pheight / 8) * 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
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
  inputboxwrap: {
    width: '70%',
  },
  sexbtn: {
    width: '48.8%',
    height: 44,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sextxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b1b1b1',
    marginLeft: 10,
  },
  idpwstatustxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff4a4a',
    marginHorizontal: 12,
  },
  birthinputv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    height: 44,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
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
    height: (pheight / 8) * 3,
    alignItems: 'center',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
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
});

export default Register;

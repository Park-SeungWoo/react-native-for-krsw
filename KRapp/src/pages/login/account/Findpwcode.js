import React, {useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {useEffect} from 'react/cjs/react.development';
import {IPADDR} from '../../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const Findpwcode = ({navigation, route}) => {
  const [code, setCode] = useState(new Array(4).fill('')); // to save code
  const [counter, setCounter] = useState(60); // countdown
  const refarr = useRef([]); // to focus on TextInputs
  const [onfocus, setOnfocus] = useState(''); // set focus
  let timer; // timer interval

  const {email} = route.params;

  useEffect(() => refarr.current[0].focus(), []);

  useEffect(() => {
    // timer
    if (parseInt(counter) <= 0) {
      clearInterval(timer);
    } else {
      timer = setInterval(() => {
        setCounter(parseInt(counter) - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);

  const _codeInput = (idx, txt) => {
    if (code[idx].length == 0) {
      setCode(prev => {
        let d = [...prev];
        d[idx] = txt;
        return [...d];
      });
      if (idx < 3) refarr.current[idx + 1].focus();
    } else {
      setCode(prev => {
        let d = [...prev];
        d[idx] = txt;
        return [...d];
      });
      if (idx > 0) refarr.current[idx - 1].focus();
    }
  };

  const _resendCode = () => {
    const option = {
      method: 'GET',
    };
    fetch(`http://${IPADDR}/find/getcode?email=${email}`, option);
    refarr.current[0].focus();
    setCode(['', '', '', '']);
    setCounter(60);
  };

  const _submitCode = () => {
    fetch(`http://${IPADDR}/find/valcode?code=${code.join('')}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(json => {
        if (json) {
          clearInterval(timer);
          Keyboard.dismiss();
          navigation.push('Changepw', {email: email});
        } else {
          refarr.current[0].focus();
          setCode(['', '', '', '']);
          alert('인증 코드가 일치하지 않습니다.');
        }
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.main}>
        <View style={styles.codeinputwarp}>
          {code.map((_, idx) => {
            const ID = 'TI' + idx;
            return (
              <View
                key={idx}
                style={
                  onfocus == ID
                    ? {
                        ...styles.inputbox,
                        borderColor: '#3eef8f',
                      }
                    : styles.inputbox
                }>
                <TextInput
                  ref={ref => refarr.current.push(ref)}
                  style={styles.input}
                  textAlignVertical="center"
                  textAlign="center"
                  placeholderTextColor="#a1a1a1"
                  keyboardType="number-pad"
                  value={code[idx]}
                  maxLength={1}
                  onChangeText={txt => {
                    _codeInput(idx, txt);
                  }}
                  onFocus={e => {
                    setOnfocus(ID);
                  }}
                />
              </View>
            );
          })}
        </View>
        <Text style={styles.txt}>{counter}초</Text>
        {counter == 0 ? (
          <TouchableOpacity
            style={{...styles.submitbtn, backgroundColor: '#ff4a4a'}}
            onPress={_resendCode}>
            <Text>재전송</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={code.join('').length != 4}
            onPress={_submitCode}
            style={
              code.join('').length == 4
                ? {...styles.submitbtn, backgroundColor: '#3eef8f'}
                : {...styles.submitbtn, backgroundColor: '#afafaf'}
            }>
            <Text>제출</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
  },
  codeinputwarp: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputbox: {
    width: 50,
    height: 50,
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
  },
  txt: {
    fontSize: 13,
    color: '#ff4a4a',
  },
});

export default Findpwcode;

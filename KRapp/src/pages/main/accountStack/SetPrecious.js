import React, {useEffect, useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import sendPushNotification from '../../../methods/sendPushNotification';
import {IPADDR} from '../../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const pheight = Dimensions.get('window').height;

const SetPrecious = ({navigation, route}) => {
  const [partname, setPartname] = useState('');
  const [partid, setPartid] = useState('');
  const [date, setDate] = useState(new Date());
  const {
    userdata: {name, id, sex},
  } = route.params;

  const BSref = useRef(); // for bottom sheet
  // bottom sheet component
  const BSheetcomp = () => {
    return (
      <View
        style={{
          backgroundColor: '#111111dd',
          justifyContent: 'flex-start',
          height: 350,
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
        <Text
          style={{
            color: '#f1f1f1',
            fontSize: 25,
            marginTop: 30,
            alignSelf: 'center',
            fontWeight: 'bold',
          }}>
          처음 만난 날
        </Text>
        <DateTimePicker
          // style={{margin: 20}}
          value={date}
          mode={'date'}
          display="spinner"
          textColor="white"
          onChange={(e, d) => _dateChanged(d)}
        />
      </View>
    );
  };

  useEffect(() => {
    fetch(`http://${IPADDR}/couple/find?id=${id}`, {method: 'GET'})
      .then(res => res.json())
      .then(json => {
        if (json) {
          console.log('exsist', id);
          // if json.persons.length != 2 => wait
          // if json.persons.length == 2 => go to home
        } else {
          console.log('nope', id);
          // make user to fill this form or wait for a couple request
        }
      });
  }, []);

  const _dateChanged = newd => {
    setDate(newd);
  };

  const _submitClick = () => {
    // find partner's token to send notification
    fetch(`http://${IPADDR}/token/find?id=${partid}&name=${partname}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(json => {
        if (json) {
          // send notification
          const data = {
            reqname: name,
            resname: partname,
            reqid: id,
            resid: partid,
            firstmeet: new Date(date.setDate(date.getDate() + 1)),
          };
          sendPushNotification(
            [json.token],
            'KRApp',
            '나의 애인이 되어줄래?',
            data,
          );
        } else {
          console.log('false');
        }
      });
  };

  return (
    <View style={styles.main}>
      {/* <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={45}> */}
      <View style={styles.topper}>
        <Text style={styles.txt}>안녕하세요 {name}님!</Text>
        <Text style={styles.txt}>
          {sex == 'M' ? '여자친구' : '남자친구'} 에게{'\n'}ID : {id}를
          알려주거나{'\n'}아래 사항들을 입력해주세요!
        </Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          BSref.current.snapTo(0);
          Keyboard.dismiss();
        }}>
        <View style={styles.body}>
          <View style={styles.birthinputv}>
            <Text style={styles.dates}>
              {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
            </Text>
            <TouchableOpacity
              style={styles.datebtn}
              onPress={() => {
                Keyboard.dismiss();
                BSref.current.snapTo(2);
              }}>
              <MaterialCommunityIcons
                name="calendar-heart"
                size={25}
                color={'black'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputbox}>
            <TextInput
              style={styles.input}
              placeholder={'Name'}
              placeholderTextColor="#a1a1a1"
              textContentType="nickname"
              value={partname}
              onChangeText={txt => setPartname(txt)}
            />
          </View>
          <View style={styles.inputbox}>
            <TextInput
              style={styles.input}
              placeholder={'ID'}
              placeholderTextColor="#a1a1a1"
              textContentType="nickname"
              value={partid}
              onChangeText={txt => setPartid(txt)}
            />
          </View>
          <TouchableOpacity style={styles.submitbtn} onPress={_submitClick}>
            <Text>회원 가입</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {/* </KeyboardAwareScrollView> */}
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '100%',
    flex: 3,
    height: pheight * 0.5,
    // borderWidth: 1,
    // borderColor: '#afafaf',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    margin: 10,
  },
  input: {
    width: '85%',
    height: 40,
    padding: 10,
    borderRadius: 10,
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
    margin: 10,
    marginTop: 20,
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
    textAlign: 'center',
  },
});

export default SetPrecious;

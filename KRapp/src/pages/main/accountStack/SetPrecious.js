import React, {useEffect, useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import sendPushNotification from '../../../methods/sendPushNotification';
import {IPADDR} from '../../../../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

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
      .then(async json => {
        if (json) {
          // save to @CoupleInfo
          const coupledata = JSON.stringify(json);
          await AsyncStorage.setItem('@CoupleInfo', coupledata);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        } else if (typeof json == 'string') {
          // err
          console.log(json);
        } else {
          fetch(`http://${IPADDR}/couple/reqorres?id=${id}`)
            .then(res => res.json())
            .then(json => {
              if (json.data == 'reqid') {
                navigation.navigate('Wait', {
                  userdata: route.params.userdata,
                });
              } else if (json.data == 'resid') {
                navigation.navigate('Accept', {
                  userdata: route.params.userdata,
                });
              } else {
                console.log('stay here');
              }
            });
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
          // add relation data temporarily
          const parttoken = json.token;
          const option = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              reqid: id,
              reqname: name,
              resid: partid,
              resname: partname,
              startdate: date,
            }),
          };
          fetch(`http://${IPADDR}/couple/add`, option)
            .then(res => res.json())
            .then(json => {
              if (json.status) {
                if (json.data) {
                  // send notification
                  const data = {
                    type: 'requestcouple',
                  };
                  sendPushNotification(
                    [parttoken],
                    'KRApp',
                    '나의 애인이 되어줄래?',
                    data,
                  );
                  // goto wating screen
                  navigation.navigate('Wait', {
                    userdata: route.params.userdata,
                  });
                } else {
                  alert(
                    `${name}님은 이미 요청을 받으셨습니다!\n승인 페이지로 이동합니다.`,
                    // go to accept
                    navigation.navigate('Accept', {
                      userdata: route.params.userdata,
                    }),
                  );
                }
              } else {
                alert(json.data);
              }
            });
        } else {
          alert('유저가 존재하지 않습니다!\n정보를 다시 한번 확인해주세요!');
        }
      });
  };

  return (
    <View style={styles.main}>
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
            <Text>요청 보내기</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
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

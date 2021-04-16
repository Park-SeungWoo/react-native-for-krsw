import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sendPushNotification from '../../../../methods/sendPushNotification';
import {IPADDR} from '../../../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const acceptCoupleRequest = ({navigation, route}) => {
  // 아니면 데이터 삭제 후 requester에게 알림
  const {userdata} = route.params;
  const [relation, setRelation] = useState({
    reqname: '',
    reqid: '',
    resname: '',
    resid: '',
    startdate: '',
  });
  useEffect(() => {
    // get temprelation data
    fetch(`http://${IPADDR}/couple/gettemp?id=${userdata.id}`, {method: 'GET'})
      .then(res => res.json())
      .then(async json => {
        if (json.status) {
          if (json.data.length == 1) setRelation(json.data[0]);
          else {
            alert('에러가 발생했습니다. 상대방에게 다시 요청해주세요');
            _deleteTemprelation(userdata.id);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
          }
        }
      });
  }, []);

  const _deleteTemprelation = id => {
    const option = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: id,
      }),
    };
    fetch(`http://${IPADDR}/couple/deletetemp`, option);
  };

  const _rejectRelation = () => {
    _deleteTemprelation(relation.resid);
    fetch(
      `http://${IPADDR}/token/find?id=${relation.reqid}&name=${relation.reqname}`,
      {method: 'GET'},
    )
      .then(res => res.json())
      .then(json => {
        sendPushNotification(
          [json.token],
          'KRapp',
          relation.resname + '님이 커플 요청을 거절했습니다.',
          {
            type: 'rejectcouple',
          },
        );
      });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const _addRelation = async () => {
    const data = {
      persons: [relation.resid, relation.reqid],
      firstp: relation.resname,
      secondp: relation.reqname,
      startdate: new Date(relation.startdate),
      roomname: `${relation.resid}_${relation.reqid}`,
    };
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(data),
    };
    // save data
    fetch(`http://${IPADDR}/couple/addrelation`, option);
    // get token, send notification
    fetch(
      `http://${IPADDR}/token/find?id=${relation.reqid}&name=${relation.reqname}`,
      {method: 'GET'},
    )
      .then(res => res.json())
      .then(json => {
        sendPushNotification(
          [json.token],
          'KRapp',
          relation.resname + '님이 커플 요청 승인했습니다.',
          {
            type: 'responsecouple',
            coupledata: data,
          },
        );
      });
    _deleteTemprelation(relation.resid);

    const coupledata = JSON.stringify(data);
    await AsyncStorage.setItem('@CoupleInfo', coupledata);

    // go to login screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topper}>
        <Text style={styles.headertxt}>커플 등록 요청이 들어왔습니다!</Text>
        <Text style={styles.desctxt}>아래 정보를 확인 해주세요</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.txt}>
          {relation.reqname}♥︎{relation.resname}
        </Text>
        <Text style={styles.txt}>
          {userdata.sex == 'M' ? '여자친구' : '남자친구'} 아이디 :{' '}
          {relation.reqid}
        </Text>
        <Text style={styles.txt}>내 아이디 : {relation.resid}</Text>
        <Text style={styles.txt}>
          처음 만난 날 : {new Date(relation.startdate).getFullYear()}-
          {new Date(relation.startdate).getMonth() + 1}-
          {new Date(relation.startdate).getDate()}
        </Text>
        <View style={styles.btns}>
          <TouchableOpacity
            style={{...styles.btn, backgroundColor: '#1f9fef'}}
            onPress={_addRelation}>
            <Text style={styles.btntxt}>수락</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.btn, backgroundColor: '#ffafaf'}}
            onPress={_rejectRelation}>
            <Text style={styles.btntxt}>거절</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#1f1f1f' : '#f1f1f1',
  },
  topper: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: 'center',
  },
  headertxt: {
    color: isDarkmode ? '#f1f1f1' : 'black',
    fontSize: 25,
  },
  desctxt: {
    color: '#afafaf',
    fontSize: 18,
  },
  body: {
    width: '100%',
    flex: 3,
    padding: 10,
    alignItems: 'center',
  },
  btns: {
    flexDirection: 'row',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btn: {
    width: '40%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntxt: {
    color: '#f1f1f1',
    fontSize: 18,
  },
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default acceptCoupleRequest;

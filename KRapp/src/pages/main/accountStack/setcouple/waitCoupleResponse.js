import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';
import {IPADDR} from '../../../../../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const waitCoupleReponse = ({navigation, route}) => {
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
    fetch(`http://${IPADDR}/couple/gettempr?id=${userdata.id}`, {method: 'GET'})
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

  return (
    <View style={styles.main}>
      <Text style={styles.txt}>
        {relation.resname}님에게 보낸 요청이 아직 처리되지 않았습니다.
      </Text>
      <Text style={styles.txt}>기다려주세요</Text>
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
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default waitCoupleReponse;

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  PlatformColor,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import {IPADDR} from '../../../../env.json';
import ReservedMessageList from '../../../components/ReservedMessageList';

const {width, height} = Dimensions.get('window');

const ReservedView = ({navigation, route}) => {
  const {userdata, coupledata} = route.params;
  const [exist, setExist] = useState(false);
  const [reserved, setReserved] = useState(new Array());

  const deleteElement = (id, idx) => {
    console.log(idx);
    setReserved(prev => {
      let newa = prev;
      newa.splice(idx, 1);
      return [...newa];
    });
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
    fetch(`http://${IPADDR}/reserved/delete`, option);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      navigation.setOptions({
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: PlatformColor('label'),
      });
      // get reserved data
      const option = {
        method: 'GET',
      };
      fetch(
        `http://${IPADDR}/reserved/get?roomname=${coupledata.roomname}&sender=${userdata.id}`,
        option,
      )
        .then(res => res.json())
        .then(json => {
          setExist(json.status);
          if (json.status) setReserved(json.datas);
        });
    });
    return unsub;
  }, [navigation]);

  return (
    <View style={styles.main}>
      <View style={styles.topper}>
        <Text style={styles.toptitletxt}>예약한 메시지 확인</Text>
      </View>
      {exist ? (
        <View style={styles.body}>
          <FlatList
            style={styles.msgslistv}
            data={reserved}
            renderItem={data => (
              <ReservedMessageList data={data} deleteElement={deleteElement} />
            )}
            keyExtractor={item => item.reserveid}
          />
        </View>
      ) : (
        <View
          style={{
            ...styles.body,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.noreservedtxt}>예약된 메시지가 없습니다!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('systemBackground'),
  },
  topper: {
    width: width,
    // height: height * 0.2,
    flex: 1,
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
    backgroundColor: PlatformColor('secondarySystemBackground'),
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  toptitletxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PlatformColor('label'),
  },
  body: {
    width: width,
    // height: height * 0.8,
    flex: 9,
  },
  msgslistv: {
    width: '100%',
    height: '100%',
  },
  noreservedtxt: {
    fontSize: 25,
    fontWeight: 'bold',
    color: PlatformColor('systemIndigo'),
  },
});

export default ReservedView;

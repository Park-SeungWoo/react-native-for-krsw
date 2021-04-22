import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PlatformColor,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const ReservedMessageList = ({data, deleteElement}) => {
  const item = data.item;

  const alertDeleteData = () => {
    if (item.sent) {
      Alert.alert(
        '전송된 예약 메시지 삭제',
        '이미 전송된 예약 메시지로 예약 메시지함에서만 삭제 됩니다. 삭제하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '삭제',
            onPress: () => {
              deleteElement(item.reserveid, data.index);
            },
          },
        ],
      );
    } else {
      Alert.alert(
        '예약 메시지 삭제',
        '전송이 되지 않은 예약 메시지 입니다.\n삭제시 메시지는 전송되지 않습니다.\n삭제하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '삭제',
            onPress: () => {
              deleteElement(item.reserveid, data.index);
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.left}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>To : </Text>
          <Text style={styles.value}>{item.toname}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Content : </Text>
          <Text style={styles.contentvalue} selectable>
            {item.data.txt}
          </Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Date : </Text>
          <Text style={styles.value}>
            {new Date(item.data.time).toLocaleString([], {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={alertDeleteData}>
          <Icon name={'trash-outline'} style={styles.deleteicon} size={30} />
        </TouchableOpacity>
        {item.sent ? <Text style={styles.senttxt}>sent</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: width,
    backgroundColor: PlatformColor('tertiarySystemGroupedBackground'),
    borderWidth: 1,
    borderColor: PlatformColor('separator'),
    padding: 10,
    // justifyContent: 'space-around',
    flexDirection: 'row',
  },
  left: {
    width: '78%',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    color: PlatformColor('label'),
    minHeight: 25,
  },
  value: {
    fontSize: 16,
    color: PlatformColor('secondaryLabel'),
    minHeight: 25,
    lineHeight: 25,
    flexShrink: 1,
  },
  contentvalue: {
    fontSize: 16,
    color: PlatformColor('secondaryLabel'),
    minHeight: 25,
    lineHeight: 25,
    flexShrink: 1,
  },
  senttxt: {
    color: PlatformColor('systemBlue'),
    fontSize: 16,
  },
  deleteicon: {
    color: PlatformColor('systemRed'),
  },
});

export default ReservedMessageList;

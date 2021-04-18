import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  PlatformColor,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const pwidth = Dimensions.get('window').width;

const ModalNestedView = ({partnick, name, text, opened, modalClose}) => {
  const [reserveDate, setReserveDate] = useState(Date.now());
  const modalscrollRef = useRef();

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', modalKeyboardWillShow);
    Keyboard.addListener('keyboardWillHide', modalKeyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardWillShow', modalKeyboardWillShow);
      Keyboard.removeListener('keyboardWillHide', modalKeyboardWillHide);
    };
  }, [opened]);

  // keyboard event listener
  const modalKeyboardWillShow = e => {
    modalscrollRef.current.scrollTo({
      x: 0,
      y: e.endCoordinates.height,
      animated: true,
    });
  };

  // keyboard event listener
  const modalKeyboardWillHide = e => {
    modalscrollRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };
  return (
    <>
      <View style={styles.modaltop}>
        <Text style={styles.modalTitle}>Reserved Message</Text>
        <TouchableOpacity onPress={() => modalClose(reserveDate)}>
          <Text style={styles.Donetxt}>Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={modalscrollRef} scrollToOverflowEnabled={true}>
        <View style={styles.modalbody}>
          <View style={styles.modalinfoview}>
            <Text style={styles.modalInfoTitle}>To : </Text>
            <Text style={styles.modalinfotxt}>{partnick}</Text>
          </View>
          <View style={styles.modalinfoview}>
            <Text style={styles.modalInfoTitle}>From : </Text>
            <Text style={styles.modalinfotxt}>{name}</Text>
          </View>
          <View style={styles.modalinfoview}>
            <Text style={styles.modalInfoTitle}>Content : </Text>
            <Text style={styles.modalinfotxt}>{text}</Text>
          </View>
          <View style={styles.modalinfoview}>
            <Text style={styles.modalInfoTitle}>Date : </Text>
            <Text style={styles.modalinfotxt}>
              {new Date(reserveDate).toDateString()}{' '}
              {new Date(reserveDate).toLocaleTimeString()}
            </Text>
          </View>
          <DateTimePicker
            value={new Date(reserveDate)}
            mode={'datetime'}
            is24Hour={true}
            display="inline"
            locale="ko"
            minimumDate={Date.now()}
            onChange={(e, date) => {
              setReserveDate(date);
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  modaltop: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: PlatformColor('separator'),
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalbody: {
    padding: 10,
  },
  modalTitle: {
    color: PlatformColor('tertiaryLabel'),
    fontSize: 20,
    fontWeight: '500',
    position: 'absolute',
    textAlign: 'center',
    width: pwidth,
  },
  Donetxt: {
    color: PlatformColor('systemBlue'),
    fontSize: 20,
    fontWeight: '600',
  },
  modalinfoview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 10,
  },
  modalInfoTitle: {
    color: PlatformColor('label'),
    fontSize: 20,
    height: 25,
  },
  modalinfotxt: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 16,
    lineHeight: 25,
    minHeight: 25,
    maxWidth: '80%',
  },
});

export default ModalNestedView;

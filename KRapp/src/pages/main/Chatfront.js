import React from 'react';
import {View, Text, StyleSheet, Appearance, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useHeaderHeight} from '@react-navigation/stack';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const {width, height} = Dimensions.get('window');

const Chatfront = ({navigation, route}) => {
  const {coupledata, userdata} = route.params;
  const headerH = useHeaderHeight();

  return (
    <View style={styles.main}>
      <View style={styles.header} />
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.list}
          onPress={() => {
            navigation.navigate('Chat', {
              coupledata: coupledata,
              userdata: userdata,
            });
          }}>
          <Text style={styles.txt}>채팅방</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#3a3a3a',
  },
  header: {
    width: '100%',
    borderWidth: 1,
    backgroundColor: isDarkmode ? '#1a1a1a' : '#f1f1f1',
    height: 100,
  },
  list: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  txt: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
});

export default Chatfront;

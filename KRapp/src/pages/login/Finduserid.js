import React from 'react';
import {Appearance, StyleSheet, View, Text} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const Finduserid = ({navigation, route}) => {
  return (
    <View style={styles.main}>
      <Text style={styles.txt}>Find id</Text>
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

export default Finduserid;

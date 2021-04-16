import React from 'react';
import {View, Text, StyleSheet, Appearance} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const Chatfront = ({data}) => {
  return (
    <View style={styles.main}>
      <Text style={styles.txt}>{new Date(data.date).toLocaleDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11111165',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  txt: {
    fontSize: 15,
    color: '#f1f1f1',
  },
});

export default Chatfront;

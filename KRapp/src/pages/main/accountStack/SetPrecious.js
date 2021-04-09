import React from 'react';
import {Appearance, StyleSheet, View, Text} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const SetPrecious = () => {
  return (
    <View style={styles.main}>
      <Text>set my darling</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SetPrecious;

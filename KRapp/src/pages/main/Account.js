import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Account = ({navigation, route}) => {
  return (
    <View style={styles.main}>
      <Text>account page</Text>
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

export default Account;

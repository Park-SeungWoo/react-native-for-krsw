import React from 'react';
import {StyleSheet, View, Text, Appearance} from 'react-native';

const isDarkmode = Appearance.getColorScheme() === 'dark';

const Account = ({navigation, route}) => {
  return (
    <View style={styles.main}>
      <Text style={styles.txt}>account page</Text>
      <Text
        style={styles.txt}
        onPress={() => {
          navigation.navigate('Setting');
        }}>
        {JSON.stringify(route.params)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#2f2f2f' : '#f1f1f1',
  },
  txt: {
    color: isDarkmode ? 'white' : 'black',
  },
});

export default Account;

import React from 'react';
import {View, Text, StyleSheet, Appearance} from 'react-native';

const isDarkmode = Appearance.getColorScheme() == 'dark';

const Chatfront = ({navigation, route}) => {
  const {coupledata, userdata} = route.params;

  return (
    <View style={styles.main}>
      <Text
        style={styles.txt}
        onPress={() => {
          navigation.navigate('Chat', {
            coupledata: coupledata,
            userdata: userdata,
          });
        }}>
        chat front
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 30,
    fontWeight: 'bold',
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Chatfront;

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Home = ({navigation, route}) => {
  const colors = ['#faafaf', '#afaffa', '#affaaf', '#fafaaf'];
  let color = 1;
  const [bcolor, setBcolor] = useState(colors[color]);
  const {userdata} = route.params;
  let interval;

  useEffect(() => {
    alert(JSON.stringify(userdata));
    interval = setInterval(() => {
      if (color < 3) {
        color += 1;
      } else {
        color = 0;
      }
      setBcolor(colors[color]);
    }, 2000);
  }, []);

  useEffect(() => {
    return clearInterval(interval);
  });

  const heart = 'Welcome to learning RN!';
  const [tog, setTog] = useState(false);

  const _Do = () => {
    setTog(!tog);
  };

  return (
    <View
      style={{...styles.main, backgroundColor: bcolor}}
      ref={ref => (back = ref)}>
      <Text style={{...styles.txt, fontSize: 60}} onPress={_Do}>
        Press me!
      </Text>
      {tog ? <Text style={styles.txt}>{heart}</Text> : null}
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
  },
});

export default Home;

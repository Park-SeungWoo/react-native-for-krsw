import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PlatformColor,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IPADDR} from '../../env.json';

const AlbumImageView = ({
  data,
  deletetog,
  userid,
  albumid,
  images,
  deleteImageFromchildren,
}) => {
  const [imginfo, setImginfo] = useState({
    uri: 'https://krapp-bucket.s3.ap-northeast-2.amazonaws.com/waiting.png',
    status: 'yet',
  });

  useEffect(async () => {
    if (data.sender != userid) {
      if (data.saved) {
        const imgdatastr = await AsyncStorage.getItem(`${albumid}`);
        const imgdata = await JSON.parse(imgdatastr);
        const img = await AsyncStorage.getItem(`${imgdata[data.imageid]}`);
        setImginfo({status: 'done', uri: img});
      } else {
      }
    } else {
      const imgdatastr = await AsyncStorage.getItem(`${albumid}`);
      const imgdata = await JSON.parse(imgdatastr);
      const img = await AsyncStorage.getItem(`${imgdata[data.imageid]}`);
      setImginfo({status: 'done', uri: img});
    }
  }, [data, images]);

  return (
    <View style={styles.main}>
      {deletetog ? (
        <TouchableOpacity
          style={styles.deletebtn}
          onPress={() => deleteImageFromchildren(data.imageid, data.url)}>
          <Icon
            name={'delete-circle-outline'}
            size={30}
            color={PlatformColor('systemRed')}
          />
        </TouchableOpacity>
      ) : null}
      {
        {
          done: (
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${imginfo.uri}`}}
            />
          ),
          yet: (
            <View style={styles.loadingv}>
              <Image
                style={{...styles.image, width: 75, height: 75}}
                source={{uri: imginfo.uri}}
              />
            </View>
          ),
        }[imginfo.status]
      }
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    borderRadius: 20,
    margin: 5,
  },
  loadingv: {
    backgroundColor: PlatformColor('systemGray2'),
    width: 175,
    height: 175,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 175,
    height: 175,
    borderRadius: 20,
    backgroundColor: PlatformColor('systemGray2'),
  },
  deletebtn: {
    position: 'absolute',
    right: 3,
    top: 3,
    zIndex: 1,
  },
});

export default AlbumImageView;

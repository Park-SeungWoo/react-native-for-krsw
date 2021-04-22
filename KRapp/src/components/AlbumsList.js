import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PlatformColor,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {IPADDR} from '../../env.json';

const {width, height} = Dimensions.get('window');

const AlbumList = ({item, navigation, addAlbum, userdata, coupledata}) => {
  const data = item;

  const getAlbumImages = async albumid => {
    return await fetch(`http://${IPADDR}/image/getimages?albumid=${albumid}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(json => {
        if (json.status) return json.data;
      });
  };

  const goToEachAlbum = async () => {
    getAlbumImages(item.albumid).then(res => {
      navigation.navigate('HomeAlbum', {
        item: item,
        userdata: userdata,
        coupledata: coupledata,
        imgdatas: res,
      });
    });
  };

  return (
    <View style={styles.main}>
      {data.albumid == 'addbtn' ? (
        <TouchableOpacity style={styles.imgwrap} onPress={addAlbum}>
          <View
            style={{
              ...styles.image,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name={'add-circle-outline'}
              size={100}
              color={PlatformColor('lightText')}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.imgwrap} onPress={goToEachAlbum}>
          <Image source={{uri: data.thumbnail}} style={styles.image} />
        </TouchableOpacity>
      )}
      <Text style={styles.albumname}>{data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    backgroundColor: PlatformColor('systemGray4'),
    margin: 10,
    borderRadius: 20,
  },
  imgwrap: {
    width: 150,
    height: 150,
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: PlatformColor('systemGray2'),
  },
  albumname: {
    color: PlatformColor('label'),
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AlbumList;

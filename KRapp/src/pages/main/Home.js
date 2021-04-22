import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PlatformColor,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {nanoid} from 'nanoid';
import getavartar from '../../methods/getAvartar';
import AlbumList from '../../components/AlbumsList';
import {IPADDR} from '../../../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const Home = ({navigation, route}) => {
  const {userdata, coupledata} = route.params;
  const [pavartar, setPavartar] = useState();
  const [mavartar, setMavartar] = useState();
  const [indicator, setIndicator] = useState(false);
  const [albums, setAlbums] = useState(
    new Object({
      addbtn: {
        name: '앨범 추가',
        albumid: 'addbtn',
      },
    }),
  );

  const getMyavartar = async () => {
    setMavartar(
      await getavartar(userdata.id, userdata.name, {
        target: 'me',
        data: userdata,
      }),
    );
  };

  const getSharedAlbum = async () => {
    await fetch(
      `http://${IPADDR}/image/getalbum?roomname=${coupledata.roomname}`,
      {method: 'GET'},
    )
      .then(res => res.json())
      .then(json => {
        if (json.status) {
          setAlbums(json.albums);
          checkAlbumsAndDelete(json.albums);
        }
      });
  };

  const checkAlbumsAndDelete = async albums => {
    let asyncalbumsstr = await AsyncStorage.getItem('@AlbumsList');
    let albumslist = Object.keys(albums).filter(d => d != 'addbtn');
    if (asyncalbumsstr != null) {
      let asyncalbums = await JSON.parse(asyncalbumsstr);
      const notinclient = albumslist.filter(d => !asyncalbums.includes(d));
      const notinserver = asyncalbums.filter(d => !albumslist.includes(d));
      if (notinclient.length != 0) {
        for (const notc of notinclient) {
          asyncalbums.push(notc);
        }
      }
      if (notinserver.length != 0) {
        for (const nots of notinserver) {
          const idx = asyncalbums.findIndex(d => d == nots);
          asyncalbums.splice(idx, 1);

          let asyncimgstr = await AsyncStorage.getItem(`${nots}`);
          let asyncimgs = await JSON.parse(asyncimgstr);
          const imgtods = Object.keys(asyncimgs);
          for (const imgid of imgtods) {
            AsyncStorage.removeItem(`${imgid}`);
          }
        }
      }
      await AsyncStorage.setItem('@AlbumsList', JSON.stringify(asyncalbums));
    } else {
      const albumsliststr = JSON.stringify(albumslist);
      await AsyncStorage.setItem('@AlbumsList', albumsliststr);
    }
  };

  useEffect(async () => {
    const unsub = navigation.addListener('focus', async () => {
      const idx = userdata.name == coupledata.firstp ? 1 : 0;
      const pname = idx ? coupledata.secondp : coupledata.firstp;
      const pid = coupledata.persons[idx];
      setPavartar(await getavartar(pid, pname, {target: 'partner'}));
      getMyavartar();
      getSharedAlbum();
    });
    return unsub;
  }, [navigation]);

  // useEffect(async () => {
  //   const idx = userdata.name == coupledata.firstp ? 1 : 0;
  //   const pname = idx ? coupledata.secondp : coupledata.firstp;
  //   const pid = coupledata.persons[idx];
  //   setPavartar(await getavartar(pid, pname, {target: 'partner'}));
  //   getMyavartar();
  //   getSharedAlbum();
  // }, [navigation]);

  const gotoProfile = () => {
    navigation.navigate('Accountnav', {
      screen: 'Account',
    });
  };

  const addAlbum = () => {
    Alert.prompt('앨범 이름 설정', '앨범 이름을 설정해주세요', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '생성',
        onPress: async txt => {
          const id = nanoid();
          const newalbum = {
            albumid: id,
            name: txt,
            images: new Array(),
            thumbnail:
              'https://krapp-bucket.s3.ap-northeast-2.amazonaws.com/image-gallery+(1).png',
          };
          setAlbums({...albums, id: newalbum});
          const option = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              roomname: coupledata.roomname,
              albumobj: newalbum,
              changedid: nanoid(),
              secchangedid: nanoid(),
            }),
          };
          await fetch(`http://${IPADDR}/image/addalbum`, option).then(
            async () => {
              const asyncalbumsstr = await AsyncStorage.getItem('@AlbumsList');
              let asyncalbums = new Array();
              if (asyncalbumsstr) {
                asyncalbums = JSON.parse(asyncalbumsstr);
              }
              asyncalbums.push(id);
              await AsyncStorage.setItem(
                '@AlbumsList',
                JSON.stringify(asyncalbums),
              );
            },
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.main} ref={ref => (back = ref)}>
      <SafeAreaView style={styles.topper}>
        <TouchableOpacity style={styles.imgtouch} onPress={gotoProfile}>
          <Image
            style={styles.image}
            source={{
              uri: mavartar,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imgtouch}>
          <Image
            style={styles.image}
            source={{
              uri: pavartar,
            }}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.body}>
        <ScrollView style={styles.albumscroll}>
          <View style={styles.albumlistvwrap}>
            <View style={styles.albumlistv}>
              {Object.values(albums).map(data => (
                <AlbumList
                  item={data}
                  navigation={navigation}
                  addAlbum={addAlbum}
                  userdata={userdata}
                  coupledata={coupledata}
                  key={data.albumid}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* activity indicator */}
      <Modal transparent visible={indicator}>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <View style={styles.indicatorV}>
            <ActivityIndicator
              animating={indicator}
              size={'large'}
              color={PlatformColor('lightText')}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  topper: {
    width: width,
    height: 200,
    flexDirection: 'row',
    backgroundColor: PlatformColor('secondarySystemBackground'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: PlatformColor('tertiarySystemBackground'),
  },
  albumscroll: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
  },
  albumlistvwrap: {
    width: width,
    alignItems: 'center',
  },
  albumlistv: {
    width: 340,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  txt: {
    fontSize: 60,
    fontWeight: 'bold',
    color: PlatformColor('label'),
  },
  imgtouch: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  indicatorV: {
    width: 150,
    height: 150,
    backgroundColor: PlatformColor('darkText'),
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default Home;

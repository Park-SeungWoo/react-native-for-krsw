import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PlatformColor,
  Image,
  ScrollView,
  TouchableOpacity,
  ActionSheetIOS,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useHeaderHeight} from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';
import {nanoid} from 'nanoid';
import AlbumImageView from '../../components/AlbumImageView';
import {IPADDR} from '../../../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

const {width, height} = Dimensions.get('window');

const HomeAlbum = ({navigation, route}) => {
  const {coupledata, userdata, item, imgdatas} = route.params;

  const [deletetog, setDeletetog] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [images, setImages] = useState(imgdatas.images);
  const [deleted, setDeleted] = useState(new Array());
  const [added, setAdded] = useState(new Array());
  const headerH = useHeaderHeight();

  const HeaderRight = () => {
    return (
      <>
        {deletetog ? (
          <TouchableOpacity
            style={{right: 10}}
            onPress={() => setDeletetog(false)}>
            <Icon
              name={'checkmark-outline'}
              size={30}
              color={PlatformColor('label')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{right: 10}} onPress={openActionSheet}>
            <Icon
              name={'menu-outline'}
              size={30}
              color={PlatformColor('label')}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: item.name,
      headerBackTitleVisible: false,
      headerTintColor: PlatformColor('label'),
      headerRight: () => <HeaderRight />,
    });
  }, [deletetog]);

  useEffect(async () => {
    setImages(imgdatas.images);
    await saveUnsavedImgs(imgdatas.images);
  }, []);

  useEffect(() => {
    setImages([...images, ...added]);
  }, [added]);

  useEffect(() => {
    setImages(imgdatas.images);
  }, [deleted]);

  const saveUnsavedImgs = async imgs => {
    for (const img of imgs) {
      if (!img.saved && img.sender != userdata.id) {
        // fetch blob and save base64 encoded img to asyncstorage
        RNFetchBlob.fetch('GET', img.url).then(async res => {
          const imgbase = res.base64();
          let asyncalbum = {};
          let imgdatas = await AsyncStorage.getItem(`${item.albumid}`);
          if (imgdatas != null) {
            const savedasync = await JSON.parse(imgdatas);
            asyncalbum = {
              ...savedasync,
            };
          }
          asyncalbum[img.imageid] = img.imageid;
          await AsyncStorage.setItem(
            `${item.albumid}`,
            JSON.stringify(asyncalbum),
          );
          await AsyncStorage.setItem(`${img.imageid}`, imgbase);

          // set saved to true
          const option = {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              albumid: item.albumid,
              imageid: img.imageid,
            }),
          };
          fetch(`http://${IPADDR}/image/saved`, option).then(() =>
            setImages(prev => {
              let newd = [...prev];
              const idx = newd.findIndex(d => d.imageid == img.imageid);
              newd[idx].saved = true;
              return [...newd];
            }),
          );
        });
      }
    }
  };

  const deleteAlbum = () => {
    setIndicator(true);
    new Promise(async (resolve, reject) => {
      const option = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          roomname: coupledata.roomname,
          albumid: item.albumid,
          changedid: nanoid(),
        }),
      };
      await fetch(`http://${IPADDR}/image/deletealbum`, option).then(
        async () => {
          const ids = JSON.parse(await AsyncStorage.getItem(`${item.albumid}`));
          if (ids != null)
            if (Object.keys(ids).length != 0)
              Object.keys(ids).forEach((value, idx) => {
                AsyncStorage.removeItem(`${value}`);
              });
          AsyncStorage.removeItem(`${item.albumid}`);
          let asyncalbums = JSON.parse(
            await AsyncStorage.getItem('@AlbumsList'),
          );
          const idx = asyncalbums.findIndex(e => e == item.albumid);
          asyncalbums.splice(idx, 1);
          await AsyncStorage.setItem(
            '@AlbumsList',
            JSON.stringify(asyncalbums),
          );
          setIndicator(false);
        },
      );
      resolve();
    }).then(() => {
      navigation.pop();
    });
  };

  const addImageToServer = async (value, strdata) => {
    let formdata = new FormData();
    formdata.append('img', {
      uri: value.path,
      name: value.filename,
      type: `image/${value.filename.split('.')[1]}`,
    });
    formdata.append('data', strdata);
    formdata.append('albumid', item.albumid);
    formdata.append('roomname', coupledata.roomname);
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };
    await fetch(`http://${IPADDR}/image/addimage`, option);
  };

  const addImage = async () => {
    const option = {
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      loadingLabelText: '이미지 불러오는중...',
      avoidEmptySpaceAroundImage: true,
      width: 12000,
      height: 12000,
      multiple: true,
      maxFiles: 30,
    };
    await ImagePicker.openPicker(option)
      .then(async imagesarr => {
        setIndicator(true);
        let additional = [];
        new Promise(async (resolve, reject) => {
          let asyncdata = await AsyncStorage.getItem(`${imgdatas.albumid}`);
          if (asyncdata) {
            asyncdata = JSON.parse(asyncdata);
          } else {
            asyncdata = {};
          }
          for (const value of imagesarr) {
            const imageid = nanoid();
            let imgdata = {
              imageid: imageid,
              saved: false,
              sender: userdata.id,
              url: '',
            };
            additional.push(imgdata);
            // setImages(prev => [...prev, imgdata]);
            asyncdata[imageid] = imageid;
            const img = JSON.stringify(imgdata);
            await addImageToServer(value, img);
            await AsyncStorage.setItem(`${imageid}`, value.data);
          }

          await AsyncStorage.setItem(
            `${imgdatas.albumid}`,
            JSON.stringify(asyncdata),
          ); // set image in local

          resolve();
        }).then(async () => {
          //   setImages(prev => [...prev, ...additional]);
          setAdded([...added, ...additional]);
          setIndicator(false);
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteImage = () => {
    setDeletetog(true);
  };

  const deleteImageFromchildren = async (id, url) => {
    const idx = images.findIndex(data => data.imageid == id);
    // delete from server
    fetch(
      `http://${IPADDR}/image/removeimg?albumid=${item.albumid}&imageid=${id}&idx=${idx}`,
      {method: 'GET'},
    );
    // delete from client
    setImages(images.splice(idx, 1));
    setDeleted([...deleted, url]);
    const asyncdatastr = await AsyncStorage.getItem(`${imgdatas.albumid}`);
    let asyncdata = JSON.parse(asyncdatastr);
    delete asyncdata[id];
    AsyncStorage.setItem(`${imgdatas.albumid}`, JSON.stringify(asyncdata));
    AsyncStorage.removeItem(`${id}`);
  };

  const openActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', '사진 추가', '사진 삭제', '앨범 삭제'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            break;
          case 1:
            addImage();
            break;
          case 2:
            deleteImage();
            break;
          case 3:
            Alert.alert(
              '앨범 삭제',
              '앨범을 삭제하면 앨범내의 모든 사진 정보가 사라집니다.\n삭제하시겠습니까?',
              [
                {
                  text: '취소',
                  style: 'cancel',
                },
                {
                  text: '삭제',
                  onPress: () => deleteAlbum(),
                  style: 'destructive',
                },
              ],
            );
            break;
        }
      },
    );
  };

  return (
    <View style={styles.main}>
      <View style={{...styles.topper, height: headerH}}></View>
      <View style={styles.body}>
        <ScrollView style={styles.imagescroll}>
          <View style={styles.imagelistvwrap}>
            <View style={styles.imagelistv}>
              {images.map(data => (
                <AlbumImageView
                  data={data}
                  deletetog={deletetog}
                  userid={userdata.id}
                  albumid={imgdatas.albumid}
                  images={images}
                  deleteImageFromchildren={deleteImageFromchildren}
                  key={data.imageid}
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
    width: width,
    height: height,
    backgroundColor: '#3a3a3a',
  },
  topper: {
    width: width,
    // backgroundColor:
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    width: 175,
    height: 175,
    borderRadius: 20,
    margin: 5,
  },
  imagescroll: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
  },
  imagelistvwrap: {
    width: width,
    alignItems: 'center',
  },
  imagelistv: {
    width: 370,
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 10,
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

export default HomeAlbum;

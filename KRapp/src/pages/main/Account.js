import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  PlatformColor,
  Dimensions,
  ActionSheetIOS,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {IPADDR} from '../../../env.json';
import getavartar from '../../methods/getAvartar';

const isDarkmode = Appearance.getColorScheme() === 'dark';
const {width, height} = Dimensions.get('window');

const Account = ({navigation, route}) => {
  const {userdata, coupledata} = route.params;

  const [avartar, setAvartar] = useState(userdata.avartar);
  const [indicator, setIndicator] = useState(false);

  useEffect(async () => {
    setAvartar(
      await getavartar(userdata.id, userdata.name, {
        target: 'me',
        data: userdata,
      }),
    );
  }, []);

  const goSetting = () => {
    navigation.navigate('Setting');
  };

  const goReserved = () => {
    navigation.navigate('Reserved', {
      userdata: userdata,
      coupledata: coupledata,
    });
  };

  const saveAvartartodb = (imgsrc, imgname, imgtype) => {
    let formdata = new FormData();
    formdata.append('img', {uri: imgsrc, name: imgname, type: imgtype});
    formdata.append('userid', userdata.id);
    formdata.append('userpw', userdata.password);
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };
    fetch(`http://${IPADDR}/image/set`, option)
      .then(res => res.json())
      .then(async json => {
        if (json.status) setAvartar(json.url);
        setIndicator(false);
      });
  };

  const setAvertarToOriginal = () => {
    const option = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: userdata.id,
        pw: userdata.password,
      }),
    };
    fetch(`http://${IPADDR}/image/setori`, option)
      .then(res => res.json())
      .then(json => {
        if (json.status) {
          setAvartar(json.url);
        } else {
          Alert.alert(
            '실패',
            '프로필 사진 삭제에 실패했습니다.\n다시 시도 해주세요.',
          );
        }
      });
  };

  const getAvartarAndSave = () => {
    const option = {
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      cropperCircleOverlay: true,
      loadingLabelText: '이미지 불러오는중...',
      avoidEmptySpaceAroundImage: true,
      width: 12000,
      height: 12000,
    };
    ImagePicker.openPicker(option)
      .then(value => {
        setIndicator(true);
        saveAvartartodb(
          value.path,
          value.filename,
          `image/${value.filename.split('.')[1]}`,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const openActionSheetIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', '갤러리에서 찾기', '삭제'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            break;
          case 1:
            getAvartarAndSave();
            break;
          case 2:
            setAvertarToOriginal();
            break;
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topper}>
        <View style={styles.profileimgv}>
          <TouchableOpacity onPress={openActionSheetIOS}>
            <Image
              style={styles.avartar}
              source={{
                uri: avartar,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infov}>
          <View style={styles.infotitlewrap}>
            <Text style={styles.infotitletxt}>Name</Text>
          </View>
          <View style={styles.infotxtwrap}>
            <Text style={styles.infotxt}>{userdata.name}</Text>
          </View>
          <View style={styles.infotitlewrap}>
            <Text style={styles.infotitletxt}>Precious</Text>
          </View>
          <View style={styles.infotxtwrap}>
            <Text style={styles.infotxt}>
              {coupledata.firstp == userdata.name
                ? coupledata.secondp
                : coupledata.firstp}
            </Text>
          </View>
          <View style={styles.infotitlewrap}>
            <Text style={styles.infotitletxt}>Phone number</Text>
          </View>
          <View style={styles.infotxtwrap}>
            <Text style={styles.infotxt}>{userdata.phonenum}</Text>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <ScrollView style={styles.bodyscroll}>
          <TouchableOpacity style={styles.menus} onPress={goReserved}>
            <Text style={styles.txt}>예약 메시지함</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menus} onPress={goSetting}>
            <Text style={styles.txt}>설정</Text>
          </TouchableOpacity>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('tertiarySystemBackground'),
  },
  topper: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 15,
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
    backgroundColor: PlatformColor('tertiarySystemBackground'),
  },
  profileimgv: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: PlatformColor('systemGray'),
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
  },
  avartar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  infov: {
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  infotxtwrap: {
    // borderTopWidth: 1,
    borderColor: PlatformColor('separator'),
    padding: 8,
    alignItems: 'center',
  },
  infotxt: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 17,
  },
  infotitlewrap: {
    borderColor: PlatformColor('systemGray'),
    borderTopWidth: 2,
    borderBottomWidth: 2,
    padding: 8,
    alignItems: 'center',
  },
  infotitletxt: {
    color: PlatformColor('label'),
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    width: '100%',
  },
  bodyscroll: {
    padding: 10,
    paddingHorizontal: 20,
  },
  menus: {
    height: 45,
    borderBottomWidth: 1,
    justifyContent: 'center',
    padding: 10,
  },
  txt: {
    color: isDarkmode ? '#f1f1f1' : 'black',
    fontSize: 25,
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

export default Account;

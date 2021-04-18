import React, {useState, useRef, useEffect} from 'react';
import {
  Appearance,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  PlatformColor,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Popoverview from 'react-native-popover-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useHeaderHeight} from '@react-navigation/stack';
import DateBar from './DateBar';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const pwidth = Dimensions.get('window').width;

const ChatListView = ({
  chat,
  userdata,
  coupledata,
  deleteChat,
  viewChat,
  partnick,
  lastidx,
  moredata,
}) => {
  // avartar
  const showavartar = chat.item.avartar;
  const [firmargin, setFirmargin] = useState(0);
  const headerH = useHeaderHeight();

  // pop over
  const popRef = useRef();
  const [showpopover, setShowpopover] = useState(false);
  let datetxt;

  // time
  if (chat.item.showdate) {
    let htemp = new Date(chat.item.time).toString().split(':')[0];
    htemp = htemp.substring(htemp.length - 3) * 1;
    let mtemp = new Date(chat.item.time).toString().split(':')[1];
    const h = htemp > 12 ? htemp - 12 : htemp;
    const m = mtemp;
    const timestatus = htemp > 11 ? 'Pm' : 'Am';
    datetxt = `${h || 12}:${m} ${timestatus}`;
  }

  useEffect(() => {
    if (!moredata) setFirmargin(chat.index == lastidx ? headerH : 0);
    if (chat.item.sender != userdata.id && chat.item.view == 1) {
      viewChat(chat.item.uniqueid);
    }
  }, []);

  const copyToClipboard = txt => {
    Clipboard.setString(txt);
    setShowpopover(false);
  };

  const _deleteMessage = align => {
    if (!chat.item.reserved) {
      if (align == 'L') {
        deleteChat(align, chat.item.uniqueid);
      } else {
        if (chat.item.deleted) {
          deleteChat(align, chat.item.uniqueid);
        } else {
          const curmin = new Date(Date.now()).getMinutes();
          const curhour = new Date(Date.now()).getHours();
          const chatmin = new Date(chat.item.time).getMinutes();
          const chathour = new Date(chat.item.time).getHours();
          if (curhour == chathour) {
            if (curmin - chatmin > 10) {
              Alert.alert(
                '삭제 실패',
                '10분이 초과하여 메시지를 삭제할 수 없습니다.',
              );
            } else {
              // can delete
              deleteChat(align, chat.item.uniqueid);
            }
          } else {
            if (50 <= chatmin - curmin) {
              // can delete
              deleteChat(align, chat.item.uniqueid);
            } else {
              Alert.alert(
                '삭제 실패',
                '10분이 초과하여 메시지를 삭제할 수 없습니다.',
              );
            }
          }
        }
      }
    } else {
      Alert.alert('삭제 실패', '예약된 메시지는 삭제할 수 없습니다.');
    }
    setShowpopover(false);
  };
  return (
    <View
      key={chat.item.uniqueid}
      style={
        chat.item.showdatebar
          ? {
              ...styles.chatV,
              justifyContent: 'center',
              marginTop: firmargin,
            }
          : chat.item.sender != userdata.id
          ? {
              ...styles.chatV,
              justifyContent: 'flex-start',
              marginTop: firmargin,
            }
          : {
              ...styles.chatV,
              justifyContent: 'flex-end',
              marginTop: firmargin,
            }
      }>
      {chat.item.showdatebar ? (
        <DateBar data={chat.item} />
      ) : (
        <>
          {chat.item.sender != userdata.id ? (
            // left text
            chat.item.deletetoleft ? null : (
              <View
                style={
                  showavartar
                    ? {...styles.LRwraper, marginTop: 25}
                    : styles.LRwraper
                }>
                <View style={styles.avatarV}>
                  {showavartar ? (
                    <>
                      <Text style={styles.nametxt}>{partnick}</Text>
                      <View style={styles.avatar}></View>
                    </>
                  ) : null}
                </View>
                <TouchableOpacity
                  ref={popRef}
                  activeOpacity={0.5}
                  onLongPress={() => {
                    setShowpopover(true);
                  }}
                  style={{...styles.textwrap, backgroundColor: '#faaffa'}}>
                  <View style={styles.textV}>
                    <Text
                      style={
                        chat.item.deleted
                          ? {...styles.chattxt, color: '#8a8a8a'}
                          : styles.chattxt
                      }>
                      {chat.item.deleted
                        ? '삭제된 메시지입니다.'
                        : chat.item.txt}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.additionalinfo}>
                  <Text
                    style={{
                      ...styles.datetxt,
                      alignSelf: 'flex-start',
                      color: PlatformColor('systemBlue'),
                    }}>
                    {chat.item.reserved ? 'r' : null}
                  </Text>
                  <Text style={styles.datetxt}>{datetxt}</Text>
                </View>
              </View>
            )
          ) : // right text
          chat.item.deletetome ? null : (
            <View
              style={
                chat.item.showdate
                  ? {...styles.LRwraper, marginBottom: 6}
                  : styles.LRwraper
              }>
              <View style={styles.additionalinfo}>
                <Text
                  style={
                    chat.item.view
                      ? styles.seentxt
                      : {...styles.seentxt, color: PlatformColor('systemBlue')}
                  }>
                  {chat.item.reserved ? 'r' : chat.item.view || null}
                </Text>
                <Text style={styles.datetxt}>{datetxt}</Text>
              </View>
              <TouchableOpacity
                ref={popRef}
                activeOpacity={0.5}
                onLongPress={() => {
                  setShowpopover(true);
                }}
                style={{...styles.textwrap, backgroundColor: '#afaffa'}}>
                <View style={styles.textV}>
                  <Text
                    style={
                      chat.item.deleted
                        ? {...styles.chattxt, color: '#8a8a8a'}
                        : styles.chattxt
                    }>
                    {chat.item.deleted ? '삭제된 메시지입니다.' : chat.item.txt}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <Popoverview
            from={popRef}
            isVisible={showpopover}
            onRequestClose={() => setShowpopover(false)}
            backgroundStyle={{opacity: 0.5}}
            popoverStyle={{borderRadius: 10}}
            arrowStyle={{backgroundColor: '#3a3a3a'}}
            arrowShift={-0.8}>
            <View style={styles.popoverV}>
              <TouchableOpacity
                style={{...styles.popoverbtn, borderRightWidth: 1}}
                onPress={() => copyToClipboard(chat.item.txt)}>
                <Ionicons
                  name={'copy-outline'}
                  style={{...styles.popovertxt, fontSize: 18}}
                />
                <Text style={styles.popovertxt}>복사</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.popoverbtn, borderLeftWidth: 1}}
                onPress={() =>
                  _deleteMessage(chat.item.sender != userdata.id ? 'L' : 'R')
                }>
                <Ionicons
                  name={'trash-outline'}
                  style={{...styles.popovertxt, fontSize: 18}}
                />
                <Text style={styles.popovertxt}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Popoverview>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatV: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  LRwraper: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  nametxt: {
    position: 'absolute',
    top: -20,
    left: 50,
    fontSize: 16,
    fontWeight: '500',
    color: isDarkmode ? '#f1f1f1' : '#2f2f2f',
  },
  avatarV: {
    width: 45,
    height: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: -20,
    borderRadius: 13,
    backgroundColor: '#f1f1f1',
  },
  datetxt: {
    fontSize: 10,
    color: isDarkmode ? '#f1f1f1' : '#000',
    alignSelf: 'flex-end',
    marginHorizontal: 5,
  },
  textwrap: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: pwidth * 0.7,
    minHeight: 30, // if change this, change avartarV's height
  },
  textV: {
    flexDirection: 'row',
  },
  chattxt: {
    fontSize: 17,
    height: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  additionalinfo: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  seentxt: {
    color: '#fafa8a',
    fontSize: 11,
    marginRight: 5,
    fontWeight: '500',
  },
  popoverV: {
    width: 120,
    height: 50,
    backgroundColor: '#3a3a3a',
    flexDirection: 'row',
    padding: 4,
  },
  popoverbtn: {
    width: 55,
    height: 42,
    borderColor: '#4f4f4f',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popovertxt: {
    color: '#eaeaea',
    fontSize: 15,
    margin: 2,
  },
});

export default ChatListView;

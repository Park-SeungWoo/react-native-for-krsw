import React, {useState, useRef, useEffect} from 'react';
import {
  Appearance,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Popoverview from 'react-native-popover-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateBar from './DateBar';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const pwidth = Dimensions.get('window').width;

const ChatListView = ({chat, userdata, coupledata, deleteChat, viewChat}) => {
  // avartar
  const showavartar = chat.item.avartar;

  // pop over
  const popRef = useRef();
  const [showpopover, setShowpopover] = useState(false);

  // time
  let htemp = new Date(chat.item.time).toString().split(':')[0];
  htemp = htemp.substring(htemp.length - 3) * 1;
  let mtemp = new Date(chat.item.time).toString().split(':')[1];
  const h = htemp > 12 ? htemp - 12 : htemp;
  const m = mtemp;
  const timestatus = htemp > 12 ? 'Pm' : 'Am';

  useEffect(() => {
    if (chat.item.sender != userdata.id && chat.item.view == 1) {
      viewChat(chat.item.uniqueid);
    }
  }, []);

  const copyToClipboard = txt => {
    Clipboard.setString(txt);
    setShowpopover(false);
  };

  const _deleteMessage = align => {
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
            alert('10분이 초과하여 메시지를 삭제할 수 없습니다.');
          } else {
            // can delete
            deleteChat(align, chat.item.uniqueid);
          }
        } else {
          if (50 <= chatmin - curmin) {
            // can delete
            deleteChat(align, chat.item.uniqueid);
          } else {
            alert('10분이 초과하여 메시지를 삭제할 수 없습니다.');
          }
        }
      }
    }
    setShowpopover(false);
  };
  return (
    <View
      key={chat.item.uniqueid}
      style={
        chat.item.showdatebar
          ? {...styles.chatV, justifyContent: 'center'}
          : chat.item.sender != userdata.id
          ? {...styles.chatV, justifyContent: 'flex-start'}
          : {...styles.chatV, justifyContent: 'flex-end'}
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
                    ? {...styles.LRwraper, marginTop: 20}
                    : styles.LRwraper
                }>
                <View style={styles.avatarV}>
                  {showavartar ? (
                    <>
                      <Text style={styles.nametxt}>꾸링</Text>
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
                <Text style={styles.datetxt}>{`${h}:${m} ${timestatus}`}</Text>
              </View>
            )
          ) : // right text
          chat.item.deletetome ? null : (
            <View style={styles.LRwraper}>
              <View style={styles.additionalinfo}>
                <Text style={styles.seentxt}>{chat.item.view || null}</Text>
                <Text style={styles.datetxt}>{`${h}:${m} ${timestatus}`}</Text>
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
    marginVertical: 3,
  },
  nametxt: {
    position: 'absolute',
    top: -20,
    left: 48,
    fontSize: 16,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  avatarV: {
    width: 45,
    height: 40,
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
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: pwidth * 0.7,
    minHeight: 35,
  },
  textV: {
    flexDirection: 'row',
  },
  chattxt: {
    fontSize: 18,
    height: '100%',
    padding: 10,
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

import React, {useEffect, useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  Keyboard,
  PlatformColor,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {io} from 'socket.io-client';
import {KeyboardAccessoryView} from '@flyerhq/react-native-keyboard-accessory-view';
import 'react-native-get-random-values'; // for nanoid
import {nanoid} from 'nanoid'; // to make unique id
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ModalView} from 'react-native-ios-modal';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import sendPushNotification from '../../methods/sendPushNotification';
import {IPADDR} from '../../../env.json';
import ChatListView from '../../components/ChatListView';
import ModalNestedView from '../../components/ModalNestedView';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const socket = io(`ws://${IPADDR}`);
const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

const getpartnertoken = async (name, firstp, secondp, persons) => {
  // get token and send to partner
  const tokenindex = name == firstp ? 1 : 0;
  const tokenname = tokenindex ? secondp : firstp;
  const tokenid = persons[tokenindex];
  return await fetch(
    `http://${IPADDR}/token/find?id=${tokenid}&name=${tokenname}`,
  )
    .then(res => res.json())
    .then(json => {
      if (json) return json.token;
      else return json;
    });
};

const getDeleteStatusData = (chat, align, id) => {
  const idx = chat.findIndex(e => e.uniqueid == id);
  let datadone = chat;
  let data = {
    ...datadone[idx],
  };
  let status = '';
  if (align == 'L') {
    // lefter msg
    data = {
      ...data,
      deletetoleft: true,
    };
  } else {
    // already deleted msg
    if (data.deleted) {
      data = {
        ...data,
        deletetome: true,
      };
    } else {
      // wasn't deleted yet
      data = {
        ...data,
        deleted: true,
      };
      status = 'onlydelete';
    }
  }
  return {idx: idx, data: data, status: status};
};

const Chat = ({navigation, route}) => {
  const {userdata, coupledata} = route.params;

  const [text, setText] = useState('');
  const [chatsplus, setChatsplus] = useState(new Array());
  const [inputh, setInputh] = useState(0);
  const [partnick, setPartnick] = useState('');
  const [partID, setPartID] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [chatrange, setChatrange] = useState({start: 0, end: 30});
  const [chatleft, setChatleft] = useState(true);
  const [modalopened, setModalopened] = useState(false);
  const headerH = useHeaderHeight();
  const modalRef = useRef();
  const chatScrollRef = useRef();

  //////////////////////////////////////useEffect
  // partnet's id
  useEffect(() => {
    const idx = userdata.name == coupledata.firstp ? 1 : 0;
    const pid = coupledata.persons[idx];
    setPartID(pid);
  }, []);

  //nickname
  useEffect(() => {
    const nick = getPartnerNick();
    setPartnick(nick);
    navigation.setOptions({
      headerTitle: nick,
    });
  }, []);

  // when come back from other tabs get data
  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      setChatsplus(await getChattingdata(coupledata.roomname));
    });
    return unsub;
  }, [navigation]);

  ////////////////////////// socket related
  // socket methods
  const onuserjoined = data => {
    console.log(data);
  };

  const ondisconnect = reason => {
    console.log(reason);
  };

  const ons2cmsg = data => {
    if (data.showdatebar) {
      setChatsplus(prev => [
        data.data,
        {
          date: data.data.time,
          uniqueid: data.dateid,
          showdatebar: data.showdatebar,
        },
        ...prev,
      ]);
    } else {
      setChatsplus(prev => {
        let newd = prev;
        if (data.changeprev) {
          newd[0].showdate = false;
        }
        return [data.data, ...newd];
      });
    }
  };

  const onDeletedChat = ({data, idx}) => {
    setChatsplus(prev => {
      let newd = prev;
      newd[idx] = data;
      return [...newd];
    });
  };

  const onViewedchat = ({idx}) => {
    setChatsplus(prev => {
      let newd = prev;
      newd[idx].view = 0;
      return [...newd];
    });
  };

  const cleanupReturn = () => {
    socket.off(`${userdata.id}joined`, onuserjoined);
    socket.off('disconnect', ondisconnect);
    socket.off('s2cmsg', ons2cmsg);
    socket.off('deleted', onDeletedChat);
    socket.off('viewed', onViewedchat);
    socket.emit('leaveemit', coupledata.roomname);
    socket.disconnect();
  };

  useEffect(() => {
    // connect to the socket server
    socket.connect();
    socket.emit('joinemit', {roomname: coupledata.roomname, cli: userdata.id});

    // operate when connected to the socket server
    socket.on(`${userdata.id}joined`, onuserjoined);

    // operate when disconnected to the socket server
    socket.on('disconnect', ondisconnect);

    // recieve messages from server
    socket.on('s2cmsg', ons2cmsg);

    // recieve delete messages from server
    socket.on('deleted', onDeletedChat);

    // recieve viewed messages from server
    socket.on('viewed', onViewedchat);

    return cleanupReturn;
  }, []);

  ///////////////////////////////////////////////methods
  // get partner'snickname
  const getPartnerNick = () => {
    return coupledata.firstp == userdata.name
      ? coupledata.nicknames[1]
      : coupledata.nicknames[0];
  };

  const getMyNick = () => {
    return coupledata.firstp == userdata.name
      ? coupledata.nicknames[0]
      : coupledata.nicknames[1];
  };

  // if delete chat
  const deleteChat = (align, id) => {
    const datas = getDeleteStatusData(chatsplus, align, id);
    const previdx = datas.idx + 1;
    const previd = chatsplus[previdx].uniqueid;
    let next = {status: false, id: '', idx: -1};
    if (datas.idx != 0 && chatsplus[datas.idx].avartar && align == 'L') {
      const nextavartar = chatsplus
        .slice(0, datas.idx)
        .findIndex(e => e.avartar);
      let nextidx = datas.idx - 1;
      for (nextidx; nextidx > nextavartar; nextidx--) {
        if (!chatsplus[nextidx].deletetoleft) {
          break;
        }
      }
      next.idx = nextidx;
      next.id = chatsplus[nextidx].uniqueid;
      next.status = true;
    }

    socket.emit('deletechat', {
      id: id,
      idx: datas.idx,
      chatdata: datas.data,
      roomname: coupledata.roomname,
      next: next,
      previd: previd,
    });
    setChatsplus(prev => {
      let newd = prev;
      newd[datas.idx] = datas.data;
      if (
        (datas.data.deletetome || datas.data.deletetoleft) &&
        datas.data.showdate
      )
        newd[previdx].showdate = true;
      if (next.status) {
        newd[next.idx].avartar = true;
      }
      return [...newd];
    });
    if (datas.status == 'onlydelete') {
    }
  };

  // if chat rendered in chatlist.js
  const viewChat = id => {
    const idx = chatsplus.findIndex(e => e.uniqueid == id);
    socket.emit('viewchat', {id: id, idx: idx, roomname: coupledata.roomname});
  };

  // scroll to get more data
  const scrollTogetMorechats = async e => {
    const yoffset = e.nativeEvent.contentOffset.y;
    const boundary = (e.nativeEvent.contentSize.height - pheight) * 0.6;
    if (yoffset > boundary && chatleft && !refreshing) {
      setRefreshing(true);
      setChatsplus([
        ...chatsplus,
        ...(await getChattingdata(coupledata.roomname)),
      ]);
    }
  };

  //get data
  const getChattingdata = async roomname => {
    return await fetch(
      `http://${IPADDR}/chat/get?roomname=${roomname}&start=${chatrange.start}&end=${chatrange.end}`,
      {
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(json => {
        if (json.status) {
          setChatleft(json.more);
          setChatrange({start: chatrange.start + 30, end: chatrange.end + 30});
          setRefreshing(false);
          return json.data;
        }
      });
  };

  // send data to the certain room which includes current user.
  const sendDirectMessage = async () => {
    Keyboard.dismiss();
    if (text.trim().length != 0) {
      let data = {
        txt: text.trim(),
        sender: userdata.id,
        time: Date.now(),
        uniqueid: nanoid(),
        view: 1,
        avartar: true,
        deleted: false,
        deletetome: false,
        deletetoleft: false,
        showdate: true,
        prevdate: false,
        reserved: false,
      };

      if (socket.connected) {
        // show avartar
        if (chatsplus.length != 0) {
          const lastdata = chatsplus[0];
          const avartarS = lastdata.sender != data.sender ? true : false;
          const avartarT =
            new Date(data.time).getMinutes() !=
            new Date(lastdata.time).getMinutes()
              ? true
              : false;
          data = {
            ...data,
            avartar: avartarT || avartarS,
          };
        }

        // show time status next to chat bubble
        if (chatsplus.length != 0) {
          const senderequal = chatsplus[0].sender == data.sender ? true : false;
          const timechange =
            new Date(data.time).getMinutes() !=
            new Date(chatsplus[0].time).getMinutes()
              ? false
              : true;
          data = {
            ...data,
            prevdate: timechange && senderequal,
          };
        }

        // if date changed
        let showdatebar = false;
        const dateid = nanoid();
        if (chatsplus.length != 0) {
          showdatebar =
            new Date(chatsplus[0].time).getDate() !=
            new Date(data.time).getDate();
        } else {
          showdatebar = true;
        }

        socket.emit('c2smsg', {
          name: coupledata.roomname,
          data,
          showdatebar: showdatebar,
          dateid: dateid,
          reserved: false,
        });

        if (showdatebar) {
          const datebar = {
            date: data.time,
            showdatebar: showdatebar,
            uniqueid: dateid,
          };
          setChatsplus(prev => [data, datebar, ...prev]);
        } else {
          setChatsplus(prev => {
            let newd = prev;
            if (data.prevdate) {
              newd[0].showdate = false;
            }
            return [data, ...newd];
          });
        }
        //scroll to bottom
        chatScrollRef.current.scrollToOffset({animated: false, offset: 0});

        const token = await getpartnertoken(
          userdata.name,
          coupledata.firstp,
          coupledata.secondp,
          coupledata.persons,
        );

        sendPushNotification([token], getMyNick(), text, {
          type: 'chat',
          data,
        });

        setText('');
      } else {
        alert('네트워크 연결 확인 후 다시 전송해주세요');
      }
    }
  };

  const setReservedMessage = () => {
    Keyboard.dismiss();
    // alert('reserved!');
    modalRef.current.setVisibility(true);
    setModalopened(true);
  };

  // 2 send options
  const selectSendOption = ({nativeEvent}) => {
    if (text.trim().length != 0)
      switch (nativeEvent.actionKey) {
        case 'direct':
          sendDirectMessage();
          break;
        case 'reserve':
          setReservedMessage();
          break;
      }
    else {
      alert('먼저 내용을 추가해주세요!');
      setText('');
    }
  };

  const modalClose = reservedate => {
    Alert.alert('예약 전송', '현재 정보로 예약 메시지를 등록하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '등록',
        onPress: async () => {
          modalRef.current.setVisibility(false);
          setMessageToServer({
            date: reservedate,
            toid: partID,
            fromid: userdata.id,
            fromname: getMyNick(),
            content: text,
            roomname: coupledata.roomname,
          });
          setText('');
        },
      },
    ]);
  };

  const setMessageToServer = msgdata => {
    const {date, fromid, content, toid, fromname, roomname} = msgdata;
    const data = {
      txt: content.trim(),
      sender: fromid,
      time: date,
      uniqueid: nanoid(),
      view: 1,
      avartar: true,
      deleted: false,
      deletetome: false,
      deletetoleft: false,
      showdate: true,
      prevdate: false,
    };
    const option = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        data: data,
        ToId: toid,
        fromname: fromname,
        fromdate: Date.now(),
        roomname: roomname,
        reserveid: nanoid(),
      }),
    };
    fetch(`http://${IPADDR}/reserved/set`, option);
  };

  const renderChats = panHandlers => {
    return (
      <FlatList
        keyboardDismissMode={'interactive'}
        {...panHandlers}
        ref={chatScrollRef}
        style={styles.chatScroll}
        data={chatsplus}
        inverted
        scrollEnabled={!refreshing}
        onScroll={scrollTogetMorechats}
        renderItem={chat => (
          <ChatListView
            chat={chat}
            userdata={userdata}
            coupledata={coupledata}
            deleteChat={deleteChat}
            viewChat={viewChat}
            partnick={partnick}
            lastidx={chatsplus.length - 1}
            moredata={chatleft}
          />
        )}
        keyExtractor={item => item.uniqueid}
      />
    );
  };

  return (
    <SafeAreaView style={styles.main} edges={['bottom']}>
      <SafeAreaView style={{...styles.headerback, height: headerH}}>
        {/* <View style={styles.menuV}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name={'dots-horizontal'}
              size={33}
              color={'#f1f1f1'}
            />
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
      <KeyboardAccessoryView
        renderScrollable={renderChats}
        style={{backgroundColor: '#afafaf'}}>
        <View style={styles.inputsendV}>
          <View style={{...styles.inputv, height: Math.max(30, inputh + 10)}}>
            <TextInput
              textAlignVertical={'center'}
              style={{...styles.input, height: Math.max(20, inputh)}}
              multiline={true}
              placeholderTextColor={'#dfdfdf'}
              value={text}
              onChangeText={txt => {
                setText(txt);
              }}
              onContentSizeChange={e => {
                setInputh(Math.ceil(e.nativeEvent.contentSize.height));
              }}
            />
          </View>
          <ContextMenuButton
            style={styles.send}
            onPress={sendDirectMessage}
            onPressMenuItem={selectSendOption}
            wrapNativeComponent={true}
            activeOpacity={0.4}
            menuConfig={{
              menuTitle: '전송',
              menuItems: [
                {
                  actionKey: 'reserve',
                  actionTitle: '예약 전송',
                  icon: {
                    iconType: 'SYSTEM',
                    iconValue: 'alarm',
                  },
                },
                {
                  actionKey: 'direct',
                  actionTitle: '전송',
                  icon: {
                    iconType: 'SYSTEM',
                    iconValue: 'arrow.up.message',
                  },
                },
              ],
            }}>
            <Text style={styles.sendtxt}>전송</Text>
          </ContextMenuButton>
        </View>
      </KeyboardAccessoryView>

      {/* modal */}
      <ModalView
        ref={modalRef}
        onModalBlur={() => {
          setModalopened(false);
        }}
        onModalWillDismiss={() => {
          setModalopened(false);
        }}>
        <ModalNestedView
          partnick={partnick}
          name={userdata.name}
          text={text}
          opened={modalopened}
          modalClose={modalClose}
        />
      </ModalView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#4a4a4a',
  },
  headerback: {
    position: 'absolute',
    width: pwidth,
    backgroundColor: '#444a',
    zIndex: 1,
  },
  menuV: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  chatScroll: {
    width: pwidth,
    paddingHorizontal: 10,
  },
  inputsendV: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afafaf',
    maxHeight: 90,
    minHeight: 40,
  },
  inputv: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: '#9f9f9f',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    maxHeight: 80,
  },
  input: {
    width: '100%',
    maxHeight: 80,
    height: '90%',
    color: '#1f1f1f',
    fontSize: 20,
  },
  send: {
    width: '10%',
    height: 35,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#faafaf',
    borderRadius: 10,
  },
  sendtxt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
    width: '100%',
    textAlign: 'center',
  },
});

export default Chat;

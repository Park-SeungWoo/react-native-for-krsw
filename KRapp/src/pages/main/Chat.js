import React, {useEffect, useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Keyboard,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {io} from 'socket.io-client';
import {KeyboardAccessoryView} from '@flyerhq/react-native-keyboard-accessory-view';
import 'react-native-get-random-values'; // for nanoid
import {nanoid} from 'nanoid'; // to make unique id
import sendPushNotification from '../../methods/sendPushNotification';
import {IPADDR} from '../../../env.json';
import ChatListView from '../../components/ChatListView';
import {SafeAreaView} from 'react-native-safe-area-context';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const socket = io(`ws://${IPADDR}`);
const pwidth = Dimensions.get('window').width;

const getChattingdata = async roomname => {
  return await fetch(`http://${IPADDR}/chat/get?roomname=${roomname}`, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(json => {
      if (json.status) {
        return json.data;
      }
    });
};

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
    }
  }
  return {idx: idx, data: data};
};

const Chat = ({navigation, route}) => {
  const {userdata, coupledata} = route.params;

  const chatScrollRef = useRef();
  const [text, setText] = useState('');
  const [chatsplus, setChatsplus] = useState(new Array());
  const [inputh, setInputh] = useState(0);
  const [partnertoken, setPartnertoken] = useState();
  const headerH = useHeaderHeight();

  const deleteChat = (align, id) => {
    const datas = getDeleteStatusData(chatsplus, align, id);
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
    });
    setChatsplus(prev => {
      let newd = prev;
      newd[datas.idx] = datas.data;
      if (next.status) {
        newd[next.idx].avartar = true;
      }
      return [...newd];
    });
  };

  const viewChat = id => {
    const idx = chatsplus.findIndex(e => e.uniqueid == id);
    socket.emit('viewchat', {id: id, idx: idx, roomname: coupledata.roomname});
  };

  // when come back from other tabs
  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      setChatsplus(await getChattingdata(coupledata.roomname));
      // save partner's token
      const token = await getpartnertoken(
        userdata.name,
        coupledata.firstp,
        coupledata.secondp,
        coupledata.persons,
      );
      setPartnertoken(token);
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
      setChatsplus(prev => [data.data, ...prev]);
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

  // send data to the certain room which includes current user.
  const _socketsend = () => {
    Keyboard.dismiss();
    if (text.length != 0) {
      let data = {
        txt: text,
        sender: userdata.id,
        time: Date.now(),
        uniqueid: nanoid(),
        view: 1,
        avartar: true,
        deleted: false,
        deletetome: false,
        deletetoleft: false,
      };

      if (socket.connected) {
        // show avartar
        if (chatsplus.length != 0) {
          const lastdata = chatsplus[0];
          const avartarS = lastdata.sender != data.sender ? true : false;
          const avartarT = data.time - lastdata.time > 60000 ? true : false;
          data = {
            ...data,
            avartar: avartarT || avartarS,
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
        });

        // send notification to partner
        if (partnertoken)
          sendPushNotification([partnertoken], userdata.name, text, {
            type: 'chat',
            data,
          });
        else {
          const token = getpartnertoken(
            userdata.name,
            coupledata.firstp,
            coupledata.secondp,
            coupledata.persons,
          );
          setPartnertoken(token);
          sendPushNotification([token], userdata.name, text, {
            type: 'chat',
            data,
          });
        }

        if (showdatebar) {
          const datebar = {
            date: data.time,
            showdatebar: showdatebar,
            uniqueid: dateid,
          };
          setChatsplus(prev => [data, datebar, ...prev]);
        } else {
          setChatsplus(prev => [data, ...prev]);
        }
        setText('');
      } else {
        alert('네트워크 연결 확인 후 다시 전송해주세요');
      }
    }
  };

  const renderChats = panHandlers => {
    return (
      <FlatList
        keyboardDismissMode={'interactive'}
        {...panHandlers}
        ref={chatScrollRef}
        style={styles.chatScroll}
        data={chatsplus}
        onContentSizeChange={(w, h) => {
          // chatScrollRef.current.scrollToOffset({animated: false, offset: 0});
        }}
        inverted
        renderItem={chat => (
          <ChatListView
            chat={chat}
            userdata={userdata}
            coupledata={coupledata}
            deleteChat={deleteChat}
            viewChat={viewChat}
          />
        )}
        keyExtractor={item => item.uniqueid}
      />
    );
  };

  return (
    <SafeAreaView style={styles.main} edges={['bottom']}>
      <View style={{...styles.headerback, height: headerH}} />
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
          <TouchableOpacity style={styles.send} onPress={_socketsend}>
            <Text style={styles.txt}>chat</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAccessoryView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#dfcccf',
  },
  headerback: {
    position: 'absolute',
    width: pwidth,
    backgroundColor: '#7a7a7a7a',
    zIndex: 1,
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
    justifyContent: 'center',
    backgroundColor: '#faafaf',
    borderRadius: 10,
  },
  txt: {
    fontSize: 20,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Chat;

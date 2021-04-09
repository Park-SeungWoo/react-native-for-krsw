import React, {useEffect, useState, useRef} from 'react';
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {io} from 'socket.io-client';
import {IPADDR} from '../../../env.json';

const isDarkmode = Appearance.getColorScheme() == 'dark';
const socket = io(`ws://${IPADDR}`);

const Chat = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [chats, setChats] = useState(new Array());
  let scrollRef = useRef();

  const {userdata} = route.params;

  // when move to other tabs
  useEffect(() => {
    const unsub = navigation.addListener('blur', () => {
      socket.disconnect();
    });
    return unsub;
  }, [navigation]);

  // when come back from other tabs
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      socket.connect();
    });
    return unsub;
  }, [navigation]);

  // socket related
  useEffect(() => {
    // connect to the socket server
    socket.io.connect();

    // operate when connected to the socket server
    socket.on('connect', () => {
      // socket.emit('roorm', )
      console.log('connect');
    });

    // operate when disconnected to the socket server
    socket.on('disconnect', reason => {
      console.log(reason);
    });

    // recieve messages from server
    socket.on('s2cmsg', data => {
      console.log('s2c : ' + data.txt);
      setChats(prev => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  // send data to the certain room which includes current user.
  const _socketsend = () => {
    setChats(prev => [...prev, {txt: text, align: 'R', time: Date.now()}]);
    socket.emit('c2smsg', {name: userdata.email, msg: text, time: Date.now()});
    setText('');
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.historybox}>
        <FlatList
          ref={scrollRef}
          style={styles.chatScroll}
          data={chats}
          onContentSizeChange={(w, h) => {
            scrollRef.current.scrollToOffset({
              animated: true,
              offset: h,
            });
          }}
          renderItem={chat => {
            const h = new Date(chat.item.time).getHours();
            const m = new Date(chat.item.time).getMinutes();
            return (
              <View
                style={
                  chat.item.align == 'L'
                    ? {...styles.chatV, justifyContent: 'flex-start'}
                    : {...styles.chatV, justifyContent: 'flex-end'}
                }>
                <Text style={styles.datetxt}>
                  {h > 12 ? 'Pm' + (h - 12) : 'Am' + h}
                  {'/' + m}
                </Text>
                <Text
                  key={chat.item.time}
                  style={
                    chat.item.align == 'L'
                      ? {
                          ...styles.chattxt,
                          color: '#faaffa',
                        }
                      : {
                          ...styles.chattxt,
                          color: '#afaffa',
                        }
                  }>
                  {chat.item.txt}
                </Text>
              </View>
            );
          }}
          keyExtractor={item => item.time + item.align}
        />
      </View>
      <View style={styles.inputv}>
        <TextInput
          style={styles.input}
          placeholder={'Chat'}
          placeholderTextColor={isDarkmode ? '#a1a1a1' : '#f1f1f1'}
          value={text}
          onChangeText={txt => {
            setText(txt);
          }}
        />
      </View>
      <TouchableOpacity style={styles.send} onPress={_socketsend}>
        <Text style={styles.txt}>chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  historybox: {
    width: '80%',
    height: '40%',
    backgroundColor: isDarkmode ? '#f1f1f1' : '#1f1f1f',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    width: '100%',
    margin: 10,
  },
  chatV: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
  },
  datetxt: {
    fontSize: 10,
    color: isDarkmode ? '#000' : '#f1f1f1',
  },
  chattxt: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputv: {
    width: '80%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkmode ? '#f1f1f1' : '#1f1f1f',
    margin: 10,
    padding: 10,
  },
  input: {
    width: '100%',
    color: isDarkmode ? '#000' : '#f1f1f1',
  },
  send: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#f1f1f1',
    borderWidth: 1,
  },
  txt: {
    fontSize: 24,
    color: isDarkmode ? '#f1f1f1' : 'black',
  },
});

export default Chat;

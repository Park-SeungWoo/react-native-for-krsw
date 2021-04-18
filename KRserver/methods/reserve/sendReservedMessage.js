// scheduler로 예약메시지 꺼내와서 시간이 됐으면 chat에 등록하고, 알림 보내기
const chatMethods = require('../chatMethods');
const PushNotification = require('../sendPushNotification');
const reservedmsg = require('../../schemas/reservedmsg');
const user = require('../../schemas/user');

const sendReserved = () => {
  console.log('---------------check reserved data!---------------');
  const timenow = new Date(Date.now());
  reservedmsg.find({sent: false}, (err, datas) => {
    // find if it supposed to be sent now
    const senddatas = datas.filter(msg => {
      const msgtime = new Date(msg.data.time);
      console.log(timenow.toString(), msgtime.toString());
      return (
        msgtime.getDate() <= timenow.getDate() &&
        msgtime.getHours() <= timenow.getHours() &&
        msgtime.getMinutes() <= timenow.getMinutes()
      );
    });

    // send each reserved messages
    senddatas.forEach(async message => {
      console.log('send');
      // find user token
      let token = '';
      await user.find({id: message.toid}, (err, user) => {
        token = user[0].token;
      });

      // add message to chats
      chatMethods.addChat({
        data: {
          ...message.data,
          reserved: true,
        },
        name: message.roomname,
        reserved: true,
      });
      // send notification to user
      PushNotification.sendPushNotification(
        [token],
        '예약 메시지',
        `${message.fromname} : ${message.data.txt}`,
        {
          type: 'chat',
        },
      );

      // change sent to true in reservedmsg
      const query = {
        reserveid: message.reserveid,
      };
      const updatequery = {
        $set: {
          sent: true,
        },
      };
      reservedmsg.updateOne(query, updatequery, (err, res) => {
        console.log(`sent reserved msg : ${JSON.stringify(res)}`);
      });
    });
  });
};

exports.sendReserved = sendReserved;

require('dotenv').config();
const fetch = require('node-fetch');

const {FBAPIKEY} = process.env;

const sendPushNotification = async (tokens, titlemsg, bodymsg, dataobj) => {
  const message = {
    registration_ids: tokens,
    notification: {
      title: titlemsg,
      body: bodymsg,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
      sound: 'default',
      badgecount: 1,
    },
    data: dataobj != null ? dataobj : {},
  };

  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=' + FBAPIKEY,
    },
    body: JSON.stringify(message),
  };

  fetch('https://fcm.googleapis.com/fcm/send', option)
    // .then(res => res.json())
    // .then(json => {
    //   return json.results[0].message_id;
    // })
    .catch(err => console.log(err));
};

exports.sendPushNotification = sendPushNotification;

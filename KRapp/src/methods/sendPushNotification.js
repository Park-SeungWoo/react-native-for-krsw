import {FBAPIKEY} from '../../env.json';

const sendPushNotification = async (tokens, titlemsg, bodymsg) => {
  const message = {
    registration_ids: tokens,
    notification: {
      title: titlemsg,
      body: bodymsg,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
  };

  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=' + FBAPIKEY,
    },
    body: JSON.stringify(message),
  };

  fetch('https://fcm.googleapis.com/fcm/send', option).then(res =>
    console.log(res),
  );
};

export default sendPushNotification;

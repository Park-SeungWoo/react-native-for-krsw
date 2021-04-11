import {FBAPIKEY} from '../../env.json';

const sendPushNotification = async (tokens, titlemsg, bodymsg, dataobj) => {
  const message = {
    registration_ids: tokens,
    notification: {
      title: titlemsg,
      body: bodymsg,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
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

  fetch('https://fcm.googleapis.com/fcm/send', option).catch(err =>
    console.log(err),
  );
};

export default sendPushNotification;

import {IPADDR} from '../../env.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getavartar = async (id, name, status) => {
  const option = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      id: id,
      name: name,
    }),
  };
  return await fetch(`http://${IPADDR}/image/get`, option)
    .then(res => res.json())
    .then(json => {
      if (status.target == 'me') {
        const data = {
          ...status.data,
          avartar: json.data,
        };
        AsyncStorage.setItem('@LoginInfo', JSON.stringify(data));
      }
      return json.data;
    });
};

export default getavartar;

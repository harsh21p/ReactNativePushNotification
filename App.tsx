/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

async function TranslateApp(inputText: any, language: any) {
  const apiKey = '040fc855e71b4ec6b7cbd01d5ecce3e2';
  const endpoint = 'https://api.cognitive.microsofttranslator.com/translate';
  try {
    const response = await axios.post(
      `${endpoint}?api-version=3.0&to=${language}`,
      [{text: inputText}],
      {
        headers: {
          'Ocp-Apim-Subscription-Region': 'eastus',
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/json',
        },
      },
    );
    return await response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return '';
  }
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [selected, setSelected] = useState('India');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.lighter : Colors.lighter,
  };

  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      sendNotification(notification?.title, notification?.message);

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    senderID: '728462149537',
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  async function sendNotification(title, subtitle) {
    const t: any = await TranslateApp(
      title,
      selected == 'India' ? 'hi' : selected == 'China' ? 'zh-CN' : 'en',
    );
    const s: any = await TranslateApp(
      subtitle,
      selected == 'India' ? 'hi' : selected == 'China' ? 'zh-CN' : 'en',
    );

    console.log('Title: ', t, ' Sub-Title: ', s);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertTitle: t,
        alertBody: s,
        applicationIconBadgeNumber: 1,
      });
    } else {
      try {
        PushNotification.localNotification({
          channelId: 'cha1',
          title: t,
          message: s,
        });
      } catch (e: any) {
        console.log(e);
      }
    }
  }

  const DATA = [
    {id: 1, name: 'India'},
    {id: 2, name: 'USA'},
    {id: 3, name: 'China'},
  ];
  return (
    <SafeAreaView style={backgroundStyle}>
      <Text
        style={{color: '#000', fontSize: 20, padding: 10, fontWeight: '600'}}>
        Select country
      </Text>
      <FlatList
        style={{height: '100%'}}
        data={DATA}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              setSelected(item.name);
            }}
            style={[
              styles.buttonStyle,
              {
                backgroundColor: item.name != selected ? '#BDE3FF' : '#1482FA',
              },
            ]}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: item.name != selected ? '#000' : '#fff',
                },
              ]}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    color: 'black',
  },
  buttonStyle: {
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

export default App;

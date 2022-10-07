

import React, { useEffect, useState } from 'react';
import GetLocation from 'react-native-get-location'

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


function App() {


  const isDarkMode = useColorScheme() === 'dark';


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [form, setForm] = useState({
    latitude: '',
    longitude: '',
    loading: false,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setForm({
          ...form,
          latitude: location.latitude,
          longitude: location.longitude
        })
      })
      .catch(error => {
      })

  }, [])


  async function browseFile() {
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    const result = await launchImageLibrary(options);
    if (result.assets) {
      setFile(result.assets);
    }
  }

  async function camera() {
    const result = await launchCamera();
    if (result.assets) {
      setFile(result.assets);
    }
  }
  async function submit() {
    if(file == null){
      return ToastAndroid.show("Silahkan pilih gambar", 10);
    }
    setForm({ ...form, loading: true });
    const data = new FormData();
    data.append('file', {
      uri: file[0].uri,
      name: file[0].fileName,
      type: file[0].type
    });
    data.append('latitude', form.latitude);
    data.append('longitude', form.longitude);
    let res = await fetch(
      'http://localhost:3000',
      {
        method: 'post',
        body: data,
        redirect: 'follow'
      }
    );
    setForm({ loading: false});
    setFile(null)
    ToastAndroid.show("Gambar berhasil dikirim",10)
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ justifyContent: 'center', alignItems: 'stretch', height: '100%', padding: 20 }}>

        <Text>Latitude : {form.latitude}, longitude : {form.longitude}</Text>
        {file && <Image source={file} style={{ height: 200, width: '100%' }} box />}
        <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
          <Button title='Pilih gambar' onPress={browseFile} />
          <Text>or</Text>
          <Button title='Ambil dari kamera' onPress={camera} />
        </View>
        {form.loading ? <ActivityIndicator /> :
          <Button title='Kirim' color={"red"} onPress={submit} />
        }
      </View>
    </SafeAreaView>
  );
};

export default App;

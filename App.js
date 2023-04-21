import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const API_KEY = 'be817984b6cec74f557d1dc14d72c626'

const icons = {
  'Clear' : 'ios-sunny',
  'Clouds' : 'cloudy',
  'Rain' : 'rainy',
}

export default function App() {
  const [city, setCity] = useState()
  const [district, setDistrict] = useState()
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true)

  const getWeather = async () => {
    const permission =  await Location.requestForegroundPermissionsAsync();

    if(!permission['granted']){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    
    setCity(location[0].city)
    setDistrict(location[0].district)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    
    setDays(json.list)
    
  };

  useEffect(()=> {
    getWeather();
  }, []); //빈 배열 넣으면 맨 처음에만 실행

  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.districtName}>{district}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator = {false}
        contentContainerStyle={styles.lower}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color='black' size='large'/>
          </View>
        ) : (
          days.map((day, index) => 
            <View key = {index} style={styles.day}>
              <Text style={styles.tinyText}>
                {day.dt_txt}
              </Text>
              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}℃
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.description}>
                  {day.weather[0].main}
                </Text>
                <Ionicons style={{
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  }} name={icons[day.weather[0].main]} size={50} color="black" />
              </View>
              <Text style={styles.tinyText}>
                {day.weather[0].description}
              </Text>
            </View>
          )
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  upper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityName:{
    fontSize: 60,
    fontWeight: '600',
  },
  lower:{
    marginTop:30,
  },
  temp:{
    fontSize: 100,
    fontWeight: '500'
  },
  description:{
    fontSize: 50,
  },
  day:{
    width: windowWidth,
    alignItems:'center',
  },
  tinyText:{
    fontSize: 25,
  },
  districtName:{
    marginTop: 10,
    fontSize: 40,
    fontWeight: '600'
  },
});

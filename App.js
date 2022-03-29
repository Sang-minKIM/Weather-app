import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "904944df77ac8120e82a99b4f41e91cc";

const icons = {
  Clouds: "cloud",
  Clear: "sunny",
  Atmosphere: "aperture",
  Snow: "snow",
  Rain: "md-rainy",
  Drizzle: "md-water",
  Thunderstorm: "thunderstorm",
};

export default function App() {
  const [city, setCity] = useState("loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getLastKnownPositionAsync();
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="black" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginTop: 50,
                }}
              >
                <Ionicons
                  name={icons[day.weather[0].main]}
                  size={90}
                  color="black"
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "yellow" },
  city: { flex: 1.2, justifyContent: "center", alignItems: "center" },
  cityName: { fontSize: 68, fontWeight: "500" },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    padding: 30,
    flexDirection: "row",
    marginTop: -200,
  },
  temp: { marginTop: 10, fontSize: 130 },
  description: { marginTop: -30, fontSize: 60 },
  tinyText: { fontSize: 25 },
});

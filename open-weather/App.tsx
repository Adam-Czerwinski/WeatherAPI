import React, { useState } from 'react';
import {
  Button,
  Searchbar,
  Snackbar,
  ActivityIndicator,
  Colors,
  Text,
  Headline,
  Paragraph
} from 'react-native-paper';
import { View, StyleSheet, Image } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  function kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  function getDegreeAsText(deg: number) {
    if (deg > 11.25 && deg < 33.75) {
      return 'NNE';
    } else if (deg > 33.75 && deg < 56.25) {
      return 'ENE';
    } else if (deg > 56.25 && deg < 78.75) {
      return 'E';
    } else if (deg > 78.75 && deg < 101.25) {
      return 'ESE';
    } else if (deg > 101.25 && deg < 123.75) {
      return 'ESE';
    } else if (deg > 123.75 && deg < 146.25) {
      return 'SE';
    } else if (deg > 146.25 && deg < 168.75) {
      return 'SSE';
    } else if (deg > 168.75 && deg < 191.25) {
      return 'S';
    } else if (deg > 191.25 && deg < 213.75) {
      return 'SSW';
    } else if (deg > 213.75 && deg < 236.25) {
      return 'SW';
    } else if (deg > 236.25 && deg < 258.75) {
      return 'WSW';
    } else if (deg > 258.75 && deg < 281.25) {
      return 'W';
    } else if (deg > 281.25 && deg < 303.75) {
      return 'WNW';
    } else if (deg > 303.75 && deg < 326.25) {
      return 'NW';
    } else if (deg > 326.25 && deg < 348.75) {
      return 'NNW';
    } else {
      return 'N';
    }
  }

  const utf8 = require('utf8');
  const API_KEY = '3c01ea0679fa62c369f81ef9639d3baa';
  const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
  const API_ICON_URL = 'http://openweathermap.org/img/wn/';

  const [cityReadonly, setCityReadonly] = useState('');
  const [city, setCity] = useState('');
  const [notFoundSnackbar, setNotFoundSnackbar] = useState(false);
  const [searchingProgress, setSearchingProgress] = useState(false);
  const [displayWeatherInfo, setDisplayWeatherInfo] = useState(false);

  // sys.country
  const [country, setCountry] = useState('');
  // main.temp
  const [temperature, setTemperature] = useState('');
  // main.temp_max
  const [maxTemperature, setMaxTemperature] = useState('');
  // main.temp_min
  const [minTemperature, setMinTemperature] = useState('');
  // main.feels_like
  const [feelsLikeTemperature, setFeelsLikeTemperature] = useState('');
  // main.pressure
  const [pressure, setPressure] = useState('');
  // main.humidity
  const [humidity, setHumidity] = useState('');
  // wind.deg
  const [windDegree, setWindDegree] = useState('');
  // wind.speed
  const [windSpeed, setWindSpeed] = useState('');
  // weather.description
  const [weatherDesc, setWeatherDesc] = useState('');
  // weather.main
  const [weatherMainDesc, setWeatherMainDesc] = useState('');
  // weather[0].icon
  const [iconURL, setIconURL] = useState('');

  const findCityWeatherOnPress = () => {
    if (!city) return;

    setSearchingProgress(true);
    setDisplayWeatherInfo(false);

    const cityReqParam = encodeURIComponent(city);
    setNotFoundSnackbar(false);
    fetch(API_URL + `?q=${cityReqParam}` + ',pl' + `&appid=${API_KEY}`, {
      method: 'GET'
    })
      .then(response => {
        const jsonResponse: any = response.json().then(json => {
          if (json.cod == '404') {
            setTimeout(_ => setNotFoundSnackbar(true), 1400);
            setDisplayWeatherInfo(false);
          } else {
            setCityReadonly(city);
            setTimeout(_ => setDisplayWeatherInfo(true), 1300);

            setWindSpeed(json.wind.speed);
            setWindDegree(json.wind.deg);
            setWeatherDesc(json.weather[0].description);
            setWeatherMainDesc(json.weather[0].main);
            setCountry(json.sys.country);
            setIconURL(API_ICON_URL + json.weather[0].icon + '@2x.png');
            setFeelsLikeTemperature(
              kelvinToCelsius(+json.main.feels_like)
                .toString()
                .substring(0, 3) + ' \u2103'
            );
            setTemperature(
              kelvinToCelsius(+json.main.temp)
                .toString()
                .substring(0, 3) + ' \u2103'
            );
            setMaxTemperature(
              kelvinToCelsius(+json.main.temp_max)
                .toString()
                .substring(0, 3) + ' \u2103'
            );

            setMinTemperature(
              kelvinToCelsius(+json.main.temp_min)
                .toString()
                .substring(0, 3) + ' \u2103'
            );

            setHumidity(json.main.humidity);
            setPressure(json.main.pressure);
          }
        });
      })
      .catch(error => {
        console.error(error);
        setDisplayWeatherInfo(false);
      })
      .finally(() => {
        setTimeout(_ => setSearchingProgress(false), 900);
      });
  };

  const DayName = new Array(7);
  DayName[0] = 'niedziela ';
  DayName[1] = 'poniedziałek ';
  DayName[2] = 'wtorek ';
  DayName[3] = 'środa ';
  DayName[4] = 'czwartek ';
  DayName[5] = 'piątek ';
  DayName[6] = 'sobota ';

  const MonthName = new Array(12);
  MonthName[0] = 'stycznia ';
  MonthName[1] = 'lutego ';
  MonthName[2] = 'marca ';
  MonthName[3] = 'kwietnia ';
  MonthName[4] = 'maja ';
  MonthName[5] = 'czerwca ';
  MonthName[6] = 'lipca ';
  MonthName[7] = 'sierpnia ';
  MonthName[8] = 'września ';
  MonthName[9] = 'października ';
  MonthName[10] = 'listopada ';
  MonthName[11] = 'grudnia ';

  function getCurrentDate() {
    const Today = new Date();
    const WeekDay = Today.getDay();
    const Month = Today.getMonth();
    const Day = Today.getDate();
    let Year = Today.getFullYear();
    const Time =
      Today.getHours() +
      ':' +
      Today.getMinutes() +
      ':' +
      (Today.getSeconds() < 10 ? '0' + Today.getSeconds() : Today.getSeconds());

    if (Year <= 99) {
      Year += 1900;
    }

    return (
      DayName[WeekDay] +
      ',' +
      ' ' +
      Day +
      ' ' +
      MonthName[Month] +
      Year +
      ' ' +
      Time
    ).toString();
  }

  const renderWeather = () => {
    if (displayWeatherInfo) {
      return (
        <View style={styles.weatherContainer}>
          <View>
            <Headline>
              Aktualna pogoda w {cityReadonly}, {country}
            </Headline>
            <Paragraph>{getCurrentDate()}</Paragraph>
            <Paragraph>{weatherMainDesc + ', ' + weatherDesc}</Paragraph>
          </View>
          <View style={styles.weather2nd}>
            <Image
              style={styles.iconWeather}
              source={{
                uri: iconURL
              }}
            />
            <Text style={styles.temp}>{temperature}</Text>
            <View style={styles.weather2ndTempDetails}>
              <View style={styles.horizontalContainer}>
                <Text>Minimalna:</Text>
                <Text style={styles.tempVal}>{minTemperature}</Text>
              </View>

              <View style={styles.horizontalContainer}>
                <Text>Maksymalna:</Text>
                <Text style={styles.tempVal}>{maxTemperature}</Text>
              </View>

              <View style={styles.horizontalContainer}>
                <Text>Odczuwalna:</Text>
                <Text style={styles.tempVal}>{feelsLikeTemperature}</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.weather3rd}>
              <Text style={styles.cellText}>Wilgotność</Text>
              <Text style={[styles.rowRigth, styles.cellText]}>
                {humidity} %
              </Text>
            </View>
            <View style={styles.weather3rd}>
              <Text style={styles.cellText}>Ciśnienie</Text>
              <Text style={[styles.rowRigth, styles.cellText]}>
                {pressure} hpa
              </Text>
            </View>
            <View style={styles.weather3rd}>
              <Text style={styles.cellText}>Prędkość wiatru</Text>
              <Text style={[styles.rowRigth, styles.cellText]}>
                {windSpeed} m/s
              </Text>
            </View>
            <View style={styles.weather3rd}>
              <Text style={styles.cellText}>Kierunek wiatru</Text>
              <Text style={[styles.rowRigth, styles.cellText]}>
                {getDegreeAsText(+windDegree)} ({windDegree})
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container} testID='container-view'>
        <Searchbar
          placeholder='Wprowadź miasto'
          value={city}
          onChangeText={city => setCity(city)}
          testID='search-city'
        />
        <Button
          disabled={searchingProgress}
          onPress={findCityWeatherOnPress}
          style={styles.buttonSearch}
          testID='on-search'
          mode='contained'
        >
          Szukaj
        </Button>
        <Snackbar
          style={styles.snb}
          visible={notFoundSnackbar}
          onDismiss={() => setNotFoundSnackbar(false)}
          action={{
            label: 'zamknij',
            onPress: () => {
              // Do something
            }
          }}
        >
          Nie znaleziono podanego miasta
        </Snackbar>
        <View>{renderWeather()}</View>

        <ActivityIndicator
          style={styles.searching}
          animating={searchingProgress}
          size={70}
          color={Colors.red800}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebfaff',
    paddingVertical: 60,
    paddingHorizontal: 30,
    height: '100%'
  },
  buttonSearch: {
    width: 100,
    marginVertical: 0,
    marginLeft: 145,
    marginTop: 25
  },
  searching: {
    marginTop: 30
  },
  weatherContainer: {
    marginTop: 60
  },
  iconWeather: {
    width: 75,
    height: 75
  },
  weather2nd: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  weather2ndTempDetails: {
    width: '40%',
    marginLeft: 35
  },
  tempVal: {
    textAlign: 'right'
  },
  temp: {
    fontSize: 36
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weather3rd: {
    marginTop: 3,
    borderRadius: 3,
    borderColor: Colors.black,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  rowRigth: {
    borderLeftColor: Colors.black,
    borderLeftWidth: 1,
    width: 120,
    textAlign: 'center'
  },
  cellText: {
    paddingVertical: 5,
    paddingLeft: 10,
    fontSize: 18,
    color: Colors.blueGrey600
  },
  snb:{
    position: "absolute",
    width:"100%",
    bottom: 660,
    left: 20
  }
});

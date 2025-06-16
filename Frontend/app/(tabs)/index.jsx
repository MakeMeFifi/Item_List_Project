import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import background from "@/assets/images/background.png"

const App = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={background} resizeMode='cover' style={styles.image}>
        <Text style={styles.text}>Das ist ein test meine Kerle</Text>
      </ImageBackground>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: {background},
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
})
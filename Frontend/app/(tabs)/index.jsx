import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import World from '@/assets/images/World.png'

const App = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={World} resizeMode='contain' style={styles.image}>
        <Text style={styles.text}>List App</Text>
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
    resizeMode: 'contain',
    justifyContent: 'center',
  }
})
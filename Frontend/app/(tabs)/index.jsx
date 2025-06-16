import { View, Text, StyleSheet, ImageBackground, Button } from 'react-native'
import { useState } from 'react'
import background from "@/assets/images/background.png"

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <View style={styles.container}>
      <ImageBackground source={background} resizeMode='cover' style={styles.image}>
        <Text style={styles.text}>Das ist ein test meine Kerle</Text>
        <Text style={styles.text}>Hier ist ne Zahl {count}</Text>
        <Button title='Drück mich mal' onPress={() => setCount(count + 1)} />
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
    padding: 10,
    marginTop: 100
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }
})
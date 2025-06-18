import { View, Text, StyleSheet, ImageBackground, Button } from 'react-native'
import { useState, useEffect } from 'react'
import background from "@/assets/images/background.png"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [currentId, setCurrentId] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchId = async () => {
      const id = await AsyncStorage.getItem("id")
      setCurrentId(id)
    }
    fetchId()
  }, [])

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id")
    setCurrentId(null)
    navigation.reset({
      index: 0,
      routes: [{ name: "login" }],
    })
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={background} resizeMode='cover' style={styles.image}>
        <Text style={styles.text}>Das ist ein test meine Kerle</Text>
        <Text style={styles.text}>Hier ist ne Zahl {count}</Text>
        <Button title='Drück mich mal' onPress={() => {setCount(count + 1); setIsVisible(!isVisible)}} />
        <Button title='entferne ID' onPress={handleLogout}/>
        {isVisible && <Text style={styles.text}>Ich bin sichtbar</Text>}
        <Text style={styles.text}> Deine zuzeitige ID : {currentId}</Text>
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
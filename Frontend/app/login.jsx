import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity} from 'react-native'
import  { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import background from "@/assets/images/background.png"

const Login = () => {
    const [firstName, setfirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const navigation = useNavigation()

    function login() {
        if(firstName === "" || lastName === "") {
            return
        }
        fetch("http://192.168.2.35:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "firstname": firstName,
                "lastname" : lastName
            })
        }
    )
    .then(response => response.json())
    .then(result => {
        if (result === false) {
            alert("User existiert nicht")
            return
        }else {
            AsyncStorage.setItem("id", String(result))
            .then(() => {
                navigation.navigate("(tabs)")
            })
        }
    })
    }
    async function checkIfLoggedIn(navigation) {
        const user = await AsyncStorage.getItem("id")
        if (user === null) { // Wenn der User noch nicht eingeloggt wird, bleibt er auf der Login Page
            return
        }
        else {
            navigation.navigate("(tabs)")
        }
    }


    useEffect(() => {       // prüft ob eingeloggt
        checkIfLoggedIn(navigation)
    },[navigation])

    return (
    <View style={styles.container}>
        <ImageBackground source={background} resizeMode='cover' style={styles.background}>
            <Text style={styles.text}>Melde dich an du Schwein</Text>
            <TextInput style={styles.input} placeholder='Vorname' value={firstName} onChange={(event) => setfirstName(event.nativeEvent.text)}/>
            <TextInput style={styles.input} placeholder='Nachname' value={lastName} onChange={(event) => setLastName(event.nativeEvent.text)}/>
            <TouchableOpacity style= {{width: "70%", borderRadius: 20, marginTop: 50, backgroundColor: 'rgba(50, 102, 198, 0.5)',}} onPress={() => login()}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style= {{width: "70%", borderRadius: 20, marginTop: 50, backgroundColor: 'rgba(50, 65, 198, 0.5)',}}>
                <Text style={styles.buttonText}>Registrieren</Text>
            </TouchableOpacity>
        </ImageBackground>
    </View>
    )
}

export default Login

const styles = StyleSheet.create({
    text: {
        color: "gray",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10, 
        width: "100%",
        marginTop: 50,
        borderRadius: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    background : {
        resizeMode: 'cover',
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    input : {
        height:50,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        width: "80%",
        marginTop: 50,
        borderRadius: 20,
        color: "white",
        fontSize: 20
    },
    buttonText: {
        color: "gray",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10, 
        width: "100%",
        borderRadius: 20
    },
})
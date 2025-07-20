import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import { Collapsible } from '@/components/Collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from "@/components/ui/IconSymbol";
import {Checkbox} from 'expo-checkbox';

const ToDo = () => {
    const [tasks, setTasks] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const date = new Date().toLocaleDateString('de-DE')

    function getToDoItems() {
        fetch("http://192.168.2.35:8000/getToDo")
        .then(respnse => respnse.json())
        .then(data => {
            if(!data) {
                alert("keine Daten vorhanden")
                return
            }else{
                setTasks(data)
                return
            }
        })
    }

    useEffect(() => getToDoItems(), [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkliste</Text>
            <Text style={styles.text}>heute ist der {date}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>
                    + neuen Auftrag hinzufügen
                </Text>
            </TouchableOpacity>
            {tasks.length === 0 && <Text style={styles.noTaskText}>Gerade keine Aufgaben offen</Text>}
        </View>
    )
}

export default ToDo

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: "rgba(66, 87, 125, 0.4)",
        justifyContent: "flesx-start",
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
    },
    addButton: {
        alignSelf: "stretch",
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
        margin: 20,
        borderRadius: 10,
    },
    addButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    text: {
        textAlign: "center",
        fontSize: 20,
        color: "#fff",
        margin: 10
    },
    noTaskText: {
        color: "white",
        fontSize: 20,
        margin: 10,
        textAlign: "center",
        backgroundColor: 'rgba(50, 102, 198, 0.2)',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
    }
})
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import { Collapsible } from '@/components/Collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from "@/components/ui/IconSymbol";
import {Checkbox} from 'expo-checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
const ToDo = () => {
    const [tasks, setTasks] = useState([])
    const [allUsers, setAllUsers] = useState(["keine User verfügbar"])
    const [modalVisible, setModalVisible] = useState(false)
    const [newTask, setNewTask] = useState({name: "", beauftragter: "", deadline: ""})
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState("")
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

    function getAllUsers() {
        fetch("http://192.168.2.35:8000/getAllUsers")
        .then(response => response.json())
        .then(data => {
            if(!data) {
                setAllUsers(["Keine Users verfügbar"])
                return
            }else {
                setAllUsers(data)
                setSelectedUser(data[0].name)
                return
            }
        })
    }

    useEffect(() => getToDoItems(), [])
    useEffect(() => getAllUsers(), [])

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





            {/* BlurView overlay when modal is visible */}
            {modalVisible && (
                <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            {/* Modal should be rendered after BlurView so it's above the blur */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style= {styles.modalWindow}>
                        <View style={styles.closingWindow}>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.closingButton}>
                                <Text style={styles.buttonText}>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalTitle}>
                            Neue Aufgabe hinzufügen
                        </Text>
                        <TextInput style={styles.input} placeholderTextColor="#fff" placeholder='Name' />
                        <Picker
                            selectedValue={selectedUser}
                            onValueChange={(userID) => setSelectedUser(userID)}>
                            {allUsers.map((user,index) => (
                                <Picker.Item key={index} label={user.name} value={user.id}/>
                            ))}
                        </Picker>
                        <TextInput style={styles.input} placeholderTextColor="#fff" placeholder='Wer?'/>                            
                        <View>
                            <Button title="Show Date Picker" onPress={() => setIsDatePickerVisible(true)} />
                            <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={() => setNewTask({...newTask,deadline: date.toLocaleDateString("de-DE")})}
                            onCancel={() =>setIsDatePickerVisible(false)}
                        />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ToDo

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: "rgba(66, 87, 125, 0.4)",
        justifyContent: "flex-start",
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalWindow: {
        backgroundColor: 'rgba(50, 102, 198, 0.2)',
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    closingWindow: {
        alignSelf: "flex-end"
    },
    closingButton: {
        borderRadius: 20,
        backgroundColor: 'rgb(255, 0, 0)',
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical: "center", // sorgt für vertikale Zentrierung auf Android
        includeFontPadding: false,   // optional: bessere Zentrierung auf Android
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 20,
        color: "#fff",
        margin: 10,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: 'rgba(30, 71, 147, 0.5)',
        margin: 20,
        padding: 10,
        fontSize: 20,
        color: "white",
        minWidth: "80%",
        borderRadius: 20,
    },
})
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput} from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import { Collapsible } from '@/components/Collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from "@/components/ui/IconSymbol";
import {Checkbox} from 'expo-checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalSelector from 'react-native-modal-selector'
const ToDo = () => {
    const [tasks, setTasks] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [newTask, setNewTask] = useState({name: "", beauftragter: "", deadline: "kein Datum ausgewählt"})
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const date = new Date().toLocaleDateString('de-DE')
    const [choosedUser, setChoosedUser] = useState("")

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
            if(!data || data.length === 0) {
                setAllUsers([{ id: "none", name: "Keine Benutzer verfügbar" }])
                return
            }else {
                setAllUsers(data)
                return
            }
        })
    }

    function setDate(newDate) {
        let splittetNewDate = newDate.split(".")
        let splittetDate = date.split(".")
        if (parseInt(splittetNewDate[0]) <= parseInt(splittetDate[0]) || parseInt(splittetNewDate[1]) < parseInt(splittetDate[1]) || parseInt(splittetNewDate[2]) < parseInt(splittetDate[2])) {
            alert("bitte wähle ein Datum in der Zukunft")
            return
        }else{
            setNewTask({...newTask,deadline: newDate})
        }
    }

    function setPerson(id,name) {
        setChoosedUser(name)
        setNewTask({...newTask, beauftragter: id})
    }

    async function addTask() {
        if(newTask.name === "" || newTask.beauftragter === "" || newTask.deadline === "kein Datum ausgewählt"){
            alert("bitte Fülle die Felder aus")
            return
        }
        const id = await AsyncStorage.getItem("id")
        fetch("http://192.168.2.35:8000/setNewTask", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name" : newTask.name,
                "deadline": newTask.deadline,
                "creater" : id,
                "PersonToDo" : newTask.beauftragter,
                "date" : date
            })
        })
        .then(response => response.json())
        .then(data => {
            if(!data) {
                alert("ein Fehler ist Passiert, bitte versuchen sie es erneut")
                return
            }
            else {
                alert("Aufgabe erfolgreich hinzugefügt!")
                getToDoItems()
                setModalVisible(false)
            }
        })
    }

    useEffect(() => getToDoItems(), [])
    useEffect(() => getAllUsers(), [])

    const userData = allUsers.map(user => ({            //bereitet ein object vor mit allen usern
        label: user.name,
        key: user.id,
    }))

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
                        <TextInput style={styles.input} placeholderTextColor="#fff" placeholder='Welche Aufgabe?' value={newTask.name} onChange={(event) => setNewTask({...newTask, name : event.nativeEvent.text})} />
                        <ModalSelector
                        data={userData}
                        initValue="Person auswählen"
                        onChange={(option) => setPerson(option.key,option.label)}
                        selectStyle={{
                            alignSelf: "stretch",
                            backgroundColor: 'rgba(50, 102, 198, 0.5)',
                            margin: 20,
                            padding: 10,
                            fontSize: 20,
                            color: "#fff",
                            minWidth: "88%",
                            borderRadius: 10,
                            borderWidth: 0
                        }}
                        selectTextStyle={{
                            color: '#fff',
                            fontSize: 20,
                            textAlign: 'center',
                            fontWeight: "bold"
                        }}
                        optionStyle={{
                            backgroundColor: 'rgba(50, 102, 198, 0.2)', // dunkles Design wie bei dir
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(255,255,255,0.1)',
                        }}
                        optionTextStyle={{
                            color: '#fff',
                            fontSize: 16,
                        }}
                        cancelStyle={{
                            backgroundColor: 'rgba(30, 71, 147, 0.3)',
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        cancelTextStyle={{
                            color: '#fff',
                            textAlign: 'center',
                            paddingVertical: 10,
                            fontWeight: 'bold',
                        }}
                         // Style des Auswahlfensters (Dropdown):
                        optionContainerStyle={{
                            backgroundColor: 'rgba(14, 40, 88, 1)',
                            borderRadius: 10,
                            marginHorizontal: 20,
                        }}
                        backdropPressToClose={true}
                        />  
                        <Text style={styles.infoText}>
                            Ausgewählt Person: {choosedUser}
                        </Text>                 
                            <TouchableOpacity style= {styles.addButton} onPress={() => setIsDatePickerVisible(true)} >
                                <Text style={styles.buttonText}>
                                    Datum hinzufügen
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) => setDate(date.toLocaleDateString("de-DE"))}
                            onCancel={() =>setIsDatePickerVisible(false)}
                            />
                            
                        <Text style={styles.infoText}>
                            Dein ausgewähltes Datum ist der: {newTask.deadline}
                        </Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.buttonText} onPress={() => addTask()}>
                                + hinzufügen
                            </Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
        margin: 20,
        borderRadius: 10,
        width: "88%",
        minWidth: "88%"
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
        margin: 10,
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
        alignSelf: "stretch"
    },
    infoText: {
        textAlign: "center",
        fontSize: 13,
        color: "#fff"
    }
})
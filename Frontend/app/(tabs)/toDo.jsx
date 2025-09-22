import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput} from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from "@/components/ui/IconSymbol";
import BouncyCheckbox from "react-native-bouncy-checkbox";
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
        fetch("http://192.168.178.34:8000/getAllUsers")
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
        let sameMonth = false
        let sameYear = false
        if(parseInt(splittetNewDate[2]) >= parseInt(splittetDate[2])){
            if(parseInt(splittetNewDate[2]) === parseInt(splittetDate[2])){
                sameYear = true
            }
            if(parseInt(splittetNewDate[1]) >= parseInt(splittetDate[1]) || !sameYear){
                if(parseInt(splittetNewDate[1]) === parseInt(splittetDate[1])) {
                    sameMonth = true
                }
                if(parseInt(splittetNewDate[0]) > parseInt(splittetDate[0]) || !sameMonth || !sameYear){
                    setNewTask({...newTask,deadline: newDate})
                }else{
                    alert("bitte wähle ein Datum in der Zukunft")
                    return
                }
            }else{
                alert("bitte wähle ein Datum in der Zukunft")
                return
            }
        }else{
            alert("bitte wähle ein Datum in der Zukunft")
            return
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
        fetch("http://192.168.178.34:8000/setNewTask", {
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

    async function changeisDoneStatus(newStat,task) {
        let response = await fetch("http://192.168.178.34:8000/changeIsDoneStatus",{
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": task,
                "status" : newStat
            })
        })
        let data = await response.json()
        if(data === true) {
            getToDoItems()
        }else{
            alert("es ist ein fehler passiert, bitte versuchen sie es erneut")
        }
    }

    async function deleteToDo(id) {
        let response = await fetch("http://192.168.178.34:8000/deleteToDo",{
            method: "DELETE",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id
            })
        })
        let data = await response.json()
        if(data === true){
            
            alert("Auftrag erfolgreich gelöscht")
            getToDoItems()
            return
        }else{
            alert("ein fehler ist passiert, bitte versuche es erneut")
            return
        }
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
            <FlatList
                data={tasks}
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                keyExtractor={task => task.id?.toString() || task.name}
                renderItem={({item}) => (
                    <View style={styles.row}>
                        <View style={styles.isDoneField}>
                            <BouncyCheckbox
                            size={30}
                            fillColor="#3B82F6" // Blau (wie dein Button oben)
                            unfillColor="transparent"
                            iconStyle={styles.iconStyle}
                            innerIconStyle={styles.innerIconStyle}
                            isChecked={item.isDone}
                            onPress={() => changeisDoneStatus(!item.isDone,item.id)}
                            />
                        </View>
                        <View style={styles.nameField}>
                            <Text style={item.isDone ? styles.doneItemText : styles.itemText}>{item.name}</Text>
                            <View style={styles.userInformationsArea}>
                                <Text style={styles.userText}> 
                                    <IconSymbol name="person" size={15} color="gray"/>Zugewiesen an: {'\n'}
                                    {item.commissioner}
                                </Text>
                                <Text style={date >= item.deadline ? styles.deadlineIsDue : styles.userText}>
                                    <IconSymbol name="calendar" size={15} color={date >= item.deadline ? "red" : "gray"}/>Frist:{"\n"}
                                    {item.deadline}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.deleteField}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteToDo(item.id)}>
                                <IconSymbol name="trash" size= {25} color= "red"/>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                )}
            />





            {/* BlurView overlay when modal is visible */}
            {modalVisible && (
                <BlurView intensity={1000} tint="dark" style={StyleSheet.absoluteFill} />
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
                            fontWeight: "bold",
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
    },
        listContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center", // sicherstellen, dass Items mittig sind
    },
    list: {
        alignSelf: "stretch",
        width: "100%",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "90%",
        width: "90%",
        marginVertical:10,
        alignSelf: "stretch",
        padding: 15 ,
        backgroundColor: 'rgba(50, 102, 198, 0.2)',
        borderRadius: 15, // optional: für schöneres Aussehen
        marginHorizontal: 30, // optional: Abstand zu den Seiten
    },
    isDoneField: {
        flex: 1,
    },
    nameField: {
        flex:4,
        flexDirection: "column",
    },
    deleteField: {
        flex: 1,
    },
    itemText: {
        textAlign: "left",
        fontSize: 20,
        color: "#fff",
        margin: 5,
    },
    deleteButton: {
        borderWidth: 2,
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 10,
        height:35,
        width:35,
        alignItems: "center",
        justifyContent: "center",
    },
    userText: {
        fontSize: 15,
        color: "gray",
    },
    userInformationsArea: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    deadlineIsDue: {
        fontSize: 15,
        color: "red",
    },
    doneItemText: {
        textAlign: "left",
        fontSize: 20,
        color: "gray",
        margin: 5,
        textDecorationLine: "line-through"
    },
})
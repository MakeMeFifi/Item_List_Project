import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import { Collapsible } from '@/components/Collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from "@/components/ui/IconSymbol";

const List = () => {
    const [listData, setListData] = useState([{"name" : "Test1", "number": "1234567890", "id": 1}, {"name" : "Test2", "number": "0987654321", "id": 2}, {"name" : "Test3", "number": "1122334455", "id": 3}]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newItem, setNewItem] = useState({name: "", number: "",location: ""});

    // Fetch the list data from the server
    function fetchListData() {
        fetch("http://192.168.2.35:8000/getList", )
        .then(response => response.json())
        .then(data => {
            if(!data) {
                alert("Keine Daten gefunden")
                return
            }else {
                setListData(data)
            }
        })
    }

    async function addItem() {
        if(newItem.name === "" || newItem.number === "" || newItem.location === "") {
            alert("Bitte fülle alle Felder aus")
            return
        }
        const id = await AsyncStorage.getItem("id")
        fetch("http://192.168.2.35:8000/put", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": newItem.name,
                "number": newItem.number,
                "location": newItem.location,
                "user": id
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result !== true) {
                alert("Item konnte nicht hinzugefügt werden")
                return
            }
            alert("Item erfolgreich hinzugefügt")
            setNewItem({name: "", number: "", location: ""}) // Reset the newItem state
            setModalVisible(false) // Close the modal
            fetchListData()
        })
    }

    function deleteItem(id) {
        fetch("http://192.168.2.35:8000/deleteItem", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result !== true) {
                alert("Item konnte nicht gelöscht werden, versuchen sie es bitte erneut")
                return
            }else {
                alert("Item erfolgreich gelöscht")
                fetchListData()
            }
        })
    }

    useEffect(() =>fetchListData(), [])


return (
    <View style={styles.container}>
        <Text style={styles.title}>Item Liste</Text>
        <FlatList 
            data={listData} 
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            keyExtractor={item => item.id?.toString() || item.name}
            renderItem={({item}) => (
                <View style={styles.row} key={item.id}>
                    <View style={styles.collapsibleWrapper}>
                        <Collapsible title={item.name}>
                            <Text style={styles.listItem}>Name: {item.name}</Text>
                            <Text style={styles.listItem}>Anzahl: {item.number}</Text>
                            <Text style={styles.listItem}>Ort: {item.location}</Text>
                        </Collapsible>
                    </View>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
                        <IconSymbol name="trash" size= {20} color= "white"/>
                    </TouchableOpacity>
                </View>
            )}
        />
        
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
                            <TouchableOpacity style={styles.closingButton} onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.buttonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.text}>Hier kannst du ein Item hinzufügen</Text>
                        <TextInput style={styles.input} placeholder='Name' value={newItem.name} onChange={(event) => setNewItem({...newItem,name: event.nativeEvent.text})}/>
                        <TextInput style={styles.input} placeholder='Ort' value={newItem.location} onChange={(event) => setNewItem({...newItem,location: event.nativeEvent.text})}/>
                        <TextInput style={styles.input} placeholder='Anzahl' value={newItem.number} onChange={(event) => setNewItem({...newItem,number: event.nativeEvent.text})}/>                            
                        <TouchableOpacity style={styles.button} onPress={() => addItem()}>
                            <Text style={styles.buttonText} >Item hinzufügen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
    </View>
)
}

export default List


const styles = StyleSheet.create({
    container:  {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgba(66, 87, 125, 0.4)",
    },
    text:{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        margin: 30,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    listContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center", // sicherstellen, dass Items mittig sind
    },
    list: {
        borderColor: 'rgba(50, 102, 198, 0.5)',
        borderWidth: 1,
        borderRadius: 10,
        alignSelf: "stretch",
        width: "100%",
    },
    listItem: {
        color: "white",
        fontSize: 20,
        marginVertical: 2,
        textAlign: "center", // Text zentrieren
        borderRadius: 10, // optional: für schöneres Aussehen
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start", // wichtig: damit Button oben bleibt
        width: "100%",
        marginVertical: 2,
        alignSelf: "stretch",
        padding: 10,
    },
    collapsibleWrapper: {
        flex: 1, // nimmt den restlichen Platz ein
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
        margin: 20,
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
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical: "center", // sorgt für vertikale Zentrierung auf Android
        includeFontPadding: false,   // optional: bessere Zentrierung auf Android
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalWindow: {
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    input: {
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        margin: 20,
        padding: 10,
        fontSize: 20,
        color: "white",
        minWidth: "80%",
        borderRadius: 20,
    },
    closingWindow: {
        alignSelf: "flex-end",
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 10,
        height:30,
        width:30,
        alignItems: "center",
        justifyContent: "center",
    },
})
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native'
import { useEffect , useState} from "react"
import { BlurView } from 'expo-blur';
import { Collapsible } from '@/components/Collapsible';
import background from "@/assets/images/background.png"
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    useEffect(() =>fetchListData(), [])


return (
    <View style={styles.container}>
        <ImageBackground source={background} style={styles.background} resizeMode="cover">
            <Text style={styles.text}>Hier ist die Liste</Text>
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={listData}
                renderItem={({ item }) => (
                    <View key={item.id} style={styles.row}>
                        <Text style={styles.listItem}>{item.name}</Text>
                        <Text style={styles.listItem}>{item.number}</Text>
                        <Text style={styles.listItem}>{item.location}</Text>
                        <Text style={styles.listItem}>{item.user}</Text>
                        <Text style={styles.listItem}>{item.location}</Text>

                    </View>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Item hinzufügen</Text>
            </TouchableOpacity>
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
        </ImageBackground> 
    </View>
)
}

export default List


const styles = StyleSheet.create({
    container:  {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "cover",
        width: "100%",
        height: "100%"
    },
    text:{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        margin: 30,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
    },
    listContainer: {
        alignItems: "center",
        flexDirection: "column",
        padding: 5,
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        width: "100%",
    },
    listItem: {
        color: "white",
        fontSize: 13,
        borderWidth: 1,
        marginVertical: 2,
        textAlign: "center",
        width: "15%",
        flexWrap: "nowrap"
    },
    list: {
        width: "auto",
        height: "auto",
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginVertical: 2,
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
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
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
    }
})
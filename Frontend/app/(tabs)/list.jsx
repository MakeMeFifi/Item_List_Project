import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native'
import { useEffect , useState} from "react"
import background from "@/assets/images/background.png"

const List = () => {
    const [listData, setListData] = useState([{"name" : "Test1", "number": "1234567890", "id": 1}, {"name" : "Test2", "number": "0987654321", "id": 2}, {"name" : "Test3", "number": "1122334455", "id": 3}]);

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

    useEffect(() =>fetchListData(), [])


return (
    <View style={styles.container}>
        <ImageBackground source={background} style={styles.background} resizeMode="cover">
            <Text style={styles.text}>Hier ist die Liste</Text>
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={listData}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text key={item.id} style={styles.listItem}>{item.name}</Text>
                            <Text key={item.id + 1} style={styles.listItem}>{item.number}</Text>
                        </View>
                    )}
                />
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
        justifyContent: "flex-start",
        flexDirection: "column",
        padding: 5,
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        width: "auto",
        
    },
    listItem: {
        color: "white",
        fontSize: 20,
        borderWidth: 1,
        marginHorizontal: 5,
        marginVertical: 2,
    },
    list: {
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        borderRadius: 10,
        margin: 5, 
        padding: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginVertical: 2,
    }
})
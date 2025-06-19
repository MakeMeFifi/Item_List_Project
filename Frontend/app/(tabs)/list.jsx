import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native'
import { useEffect , useState} from "react"
import background from "@/assets/images/background.png"

const List = () => {
    const [listData, setListData] = useState(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);

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

    useEffect(() => fetchListData(), [])


return (
    <View style={styles.container}>
        <ImageBackground source={background} style ={styles.background} resizeMode="cover">
            <Text style={styles.text}>Hier ist die Liste</Text>
            <View>
                <FlatList
                    contentContainerStyle={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: 'rgba(50, 102, 198, 0.5)', padding: 100, borderRadius: 10, width: 'auto' }}
                    data={listData}
                    renderItem={({ item }) => (
                        <Text style={styles.listItem}>{item.name}</Text>
                    )}
                />
            </View>
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
        justifyContent: "flex-start",
        alignItems: "center",
        resizeMode: "cover",
        width: "100%",
        height: "100%"
    },
    text:{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        margin: 15,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
    },
    listItem: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    list: {
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        borderRadius: 10,
        margin: 5, 
        width: '90%', 
        padding: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native'
import { useEffect , useState} from "react"
import background from "@/assets/images/background.png"

const List = () => {
    const [listData, setListData] = useState(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);



return (
    <View style={styles.container}>
        <ImageBackground source={background} style ={styles.background} resizeMode="cover">
            <Text style={styles.text}>Hier ist die Liste</Text>
            <View style={{ backgroundColor: 'rgba(50, 102, 198, 0.5)', borderRadius: 10, margin: 5 }}>
                <FlatList data={listData} renderItem={({ item }) => (
                    <Text style={styles.text}>{item}</Text>
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
        margin: 10,
        backgroundColor: 'rgba(50, 102, 198, 0.5)',
        padding: 10,
    }
})
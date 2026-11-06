import { StyleSheet, Text, View } from "react-native";

export  default function Stats() {
    return(
    <View
    style = {styles.container}
    >

        <Text
        style = {styles.text}
        >Settings</Text>
    </View>
    );
}

const styles = StyleSheet.create({
container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#2b2d2d",
},
text: {
    color:"#fff",
    fontSize:20,
}
});
import { StyleSheet, Text, View } from "react-native";

export  default function index() {
  return(
    <View
    style = {styles.container}
    >
      <Text style = {styles.text}>Home Page</Text>
      {/* <Link href={"/stats"} style = {styles.button}>
      sign up
      </Link> */}
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
  },
  button: {
    color:"#fff",
    textDecorationLine:"underline",
    fontSize:20,
  }
});
import { ScrollView, StyleSheet, Switch, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings } from "../../constants/settings";
import { useSettings } from "../../context/settingsContext";


const rows:{field:keyof Settings, label: string }[] = [
    { field: "useLbs", label: "KG/LBS" },
    { field: "textToSpeach", label: "Text To Speach" },
];

export  default function SettingsScreen() 
{

    const { settings, updateSetting } = useSettings();

    const { height } = useWindowDimensions();



return(
    <SafeAreaView  style = {styles.screen}>

        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.container}
        >
    
        <Text  style = {styles.title}> 
            Settings
        </Text>  

            <View style={styles.settingsContainer}>
                {rows.map((row) =>
                    <View key = {row.field} style = {styles.row}>
                        <View style={styles.card}>
                            <Text style={styles.text}>
                                {row.label}
                            </Text>
                            <Switch
                            value = {settings[row.field]}
                            onValueChange={(v) => updateSetting(row.field , v)}
                            trackColor={{false:"#4d4d4d" , true:"#fdce32"}}
                            accessibilityLabel={row.label}
                            />
                        </View>
                    </View>
                )}
            </View>

        </ScrollView>
    </SafeAreaView>
);
}



const styles = StyleSheet.create({
  
screen: { 
  flex: 1, 
  backgroundColor: "#2b2d2d" 
},

container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
},
  title: {
    color:"#fdce32",
    fontSize:30,
    fontWeight:"bold",
    padding:20,
  },
  card: {
    backgroundColor:"#4e4f4f",
    padding:20,
    marginTop:50,

    borderRadius:10,
    marginBottom:50,
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",

    shadowColor: "#000000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  text: {
    color:"#fff",
    fontSize:20,
  },

  row: {
    alignItems:"center",
    flexDirection:"row",
    gap:12,
    marginBottom:12,
    justifyContent:"space-between",
  },

settingsContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
},

});
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { defaultSettings, Settings } from "../constants/settings";
import { convertAllWeights } from "../utils/units";

type SettingsContextType = {
    settings: Settings;
    updateSetting: (field:keyof Settings, value:boolean) => void;
    resetSettings: () => void;
};

const settingsContext = createContext<SettingsContextType>({
    settings : defaultSettings,
    updateSetting: () => {},
    resetSettings: () => {},
});

export function SettingsProvider({children}: {children: ReactNode})
{
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    function resetSettings(){
        setSettings(defaultSettings);
    }

        useEffect(() => {
            AsyncStorage.getItem("settings").then((saved) =>{
                if (saved) setSettings({...defaultSettings,...JSON.parse(saved)});
            });
        },[]);



    async function updateSetting(field:keyof Settings, value:boolean) {
        if (field === "useLbs") 
        {
            await convertAllWeights(value);
        }
        const newSettings = { ...settings, [field]: value };
        setSettings(newSettings);
        AsyncStorage.setItem("settings", JSON.stringify(newSettings));        
    }

    return(
        <settingsContext.Provider
        value = {{settings , updateSetting, resetSettings}}>
            {children}
        </settingsContext.Provider>
    );
} 

export function useSettings(){
    return useContext(settingsContext);
}
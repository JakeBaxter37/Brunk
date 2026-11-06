import { NativeTabs } from 'expo-router/native-tabs';


export default function tabLayout() {   
return (
    <NativeTabs
    tintColor="#fdce32"
    backgroundColor="#25292e"
    >
        <NativeTabs.Trigger name="Home">
            <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon 
                sf={{default: 'house' , selected: 'house.fill'}}
                md="home"
            />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="Stats">
            <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon 
                sf={{default: 'chart.bar' , selected: 'chart.bar.fill'}}
                md="bar_chart"
            />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="Settings">
            <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon 
                sf={{default: 'gearshape' , selected: 'gearshape.fill'}}
                md="settings"
            />
        </NativeTabs.Trigger>
    </NativeTabs>
);
}


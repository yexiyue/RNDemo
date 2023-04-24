import AsyncStorage from '@react-native-async-storage/async-storage'

export async function saveData(key:string,value:any){
    try {
        if(typeof value!='string'){
            value=JSON.stringify(value)
        }
        return await AsyncStorage.setItem(key,value)
    } catch (error) {
        console.log(error)
    }
}

export async function getData(key:string) {
    try {
        const res=await AsyncStorage.getItem(key)
        return JSON.parse(res!) as Account[]
    } catch (error) {
        console.log(error)
    }
}

export async function deleteData(key:string) {
    try {
        return await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log(error)
    }
}
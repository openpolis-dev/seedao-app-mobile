import {useEffect} from "react";
import store from "../store";
import {saveAccount} from "../store/reducer";

export default function TabBar(){

    useEffect(() => {
        store.dispatch(saveAccount("123"))
    }, []);
    return <div>TabBar</div>
}

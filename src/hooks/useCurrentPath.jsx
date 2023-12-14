import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";

export default function useCurrentPath(){

    const cPath = useSelector((state) => state.currentpath);
    const location = useLocation();

    const [prevPath,setPrevPath] = useState("");


    useEffect(() => {

        if(cPath.length<2 || location.pathname !== cPath[cPath.length-1] ) return;
        setPrevPath(cPath[0])
    }, [cPath]);

    return prevPath;
}

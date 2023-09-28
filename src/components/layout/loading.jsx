import Spinner from 'react-bootstrap/Spinner';
import {useSelector} from "react-redux";

export default function Loading(){
    const loading = useSelector(state=> state.loading);

    return <>
        {
            loading && <Spinner animation="border" variant="primary" size="sm"/>
        }

    </>
}

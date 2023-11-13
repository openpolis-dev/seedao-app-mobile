import {useSelector} from "react-redux";

export default function Loading(){
    const loading = useSelector(state=> state.loading);

    return <>
        {
            loading && <div>loading</div>
        }

    </>
}

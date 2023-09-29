import RouterLink from "./router/router";
import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import store,{persistor} from "./store";
import "./locales"
import "./assets/styles/custom.scss"
import "./assets/styles/quill.css";

import GlobalStyle from "./utils/GlobalStyle";
function App() {
  return (
    <div >
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor} >
                <Router>
                    <RouterLink />
                </Router>
            </PersistGate>
        </Provider>
        <GlobalStyle />
    </div>
  );
}

export default App;

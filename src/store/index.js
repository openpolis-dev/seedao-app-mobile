import {configureStore} from "@reduxjs/toolkit";
import mainReducer from "./reducer";
import storage from 'redux-persist/lib/storage'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading", "signer", "detail", "currentpath", "cache", "snsMap", "currentSeason"],
};
const persistedReducer = persistReducer(persistConfig, mainReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
            // serializableCheck: {
            //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,'main/saveContract'],
            // }
        }),
})

export const persistor = persistStore(store)
export default store;

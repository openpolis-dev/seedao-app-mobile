import {createSlice} from '@reduxjs/toolkit';
import InitState from './initState';

const mainSlice = createSlice({
    name: 'main',
    initialState: InitState,
    reducers: {
        saveAccount(state, action) {
            state.account = action.payload;
        },
        saveLoading(state, action) {
            state.loading = action.payload;
        },
        // saveContract(state, action) {
        //     state.mainContract = action.payload;
        // },
        saveUserToken(state, action) {
            state.userToken = action.payload;
        },
        saveWalletType(state, action) {
            state.walletType = action.payload;
        },
        saveSigner(state, action) {
            state.signer = action.payload;
        }
    },
});

export const {
    saveAccount,
    saveLoading,
    // saveContract,
    saveSigner,
    saveWalletType,
    saveUserToken,
} = mainSlice.actions;
export default mainSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import InitState from './initState';

const mainSlice = createSlice({
    name: 'main',
    initialState: InitState,
    reducers: {
        clearLogin(state) {
            state.account = null;
            state.userToken = null;
            state.walletType = null;
        },
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
        },
        updateSNSmap(state, action) {
            state.snsMap = action.payload;
        },
        saveProposalCategories(state, action) { 
            state.proposalCategories = action.payload;
        }
    },
});

export const {
    clearLogin,
    saveAccount,
    saveLoading,
    // saveContract,
    saveSigner,
    saveWalletType,
    saveUserToken,
    updateSNSmap,
    saveProposalCategories
} = mainSlice.actions;
export default mainSlice.reducer;

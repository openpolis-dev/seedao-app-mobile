import {createSlice} from '@reduxjs/toolkit';
import InitState from './initState';
import { SELECT_WALLET } from 'utils/constant';

const mainSlice = createSlice({
    name: 'main',
    initialState: InitState,
    reducers: {
        clearLogin(state) {
            state.account = null;
            state.userToken = null;
            state.walletType = null;
            state.metaforoToken = null;
            localStorage.removeItem(SELECT_WALLET);
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
        },
        saveDetail(state, action) {
            state.detail = action.payload;
        },
        saveCache(state,action){
            state.cache = action.payload;
        },
        savePath(state,action){
            let arr =[...state.currentpath];
            arr.push(action.payload);
            if(arr.length>2){
                arr.shift()
            }
            state.currentpath = arr;
        },
        saveRPC(state,action){
            state.rpc = action.payload;
        },
        saveCurrentSeason(state, action) { 
            state.currentSeason = action.payload;
        },
        saveMetaforoToken(state, action) { 
            state.metaforoToken = action.payload;
        },
        saveThirdPartyToken(state, action) { 
            state.metaforoToken = action.payload.metaforo;
            state.deschoolToken = action.payload.deschool;
        }
    },
});

export const {
    clearLogin,
    saveAccount,
    saveLoading,
    saveDetail,
    savePath,
    saveCache,
    // saveContract,
    saveSigner,
    saveWalletType,
    saveUserToken,
    updateSNSmap,
    saveProposalCategories,
    saveRPC,
    saveCurrentSeason,
    saveMetaforoToken,
    saveThirdPartyToken,
} = mainSlice.actions;
export default mainSlice.reducer;

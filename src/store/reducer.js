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
        saveContract(state, action) {
            state.mainContract = action.payload;
        }
    },
});

export const {
    saveAccount,
    saveLoading,
    saveContract,
} = mainSlice.actions;
export default mainSlice.reducer;

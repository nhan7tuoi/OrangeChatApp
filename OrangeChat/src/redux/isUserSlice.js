import { createSlice } from "@reduxjs/toolkit";

const isUserSlice = createSlice({
    name: "isUser",
    initialState: {
        isUser: false,
    },
    reducers: {
        setIsUser: (state, action) => {
            state.isUser = action.payload;
        },
    },
});

export const { setIsUser } = isUserSlice.actions;
export default isUserSlice.reducer;
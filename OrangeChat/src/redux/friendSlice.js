import {createSlice} from '@reduxjs/toolkit';

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    listFriends: [],
    listFriendRequests: [],
  },
  reducers: {
    setFriends: (state, action) => {
      state.listFriends = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.listFriendRequests = action.payload;
    },
  },
});

export const {setFriends, setFriendRequests} = friendSlice.actions;
export default friendSlice.reducer;

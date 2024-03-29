import {createSlice} from '@reduxjs/toolkit';
import FriendApi from '../apis/FriendApi';

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
    updateFriendRequests: (state, action) => {
      state.listFriendRequests = state.listFriendRequests.filter(
        fq => fq._id !== action.payload,
      );
    },
    addFriendRequsts: (state, action) => {
      state.listFriendRequests.push(action.payload);
    },
  },
});

export const {setFriends, setFriendRequests, updateFriendRequests,addFriendRequsts} =
  friendSlice.actions;
export const fetchFriends = userId => async dispatch => {
  try {
    const friends = await FriendApi.getFriends({userId});
    dispatch(setFriends(friends.data));
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

export const fetchFriendRequests = userId => async dispatch => {
  try {
    const friendRequests = await FriendApi.getFriendRequests({userId});
    dispatch(setFriendRequests(friendRequests.data));
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

export default friendSlice.reducer;

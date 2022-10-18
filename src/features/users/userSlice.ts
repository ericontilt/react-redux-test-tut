import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserState {
  users: User[];
  usersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const initialState: UserState = {
  users: [],
  usersStatus: 'idle',
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async () => {
    const response = await fetch("http://localhost:3001/users");
    const data = await response.json();
    return data;
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    remove: (state, action: PayloadAction<User>) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
    update: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersStatus = 'failed';
      });
  }
});

export const selectUsers = (state: RootState) => state.user.users;
export const selectUsersStatus = (state: RootState) => state.user.usersStatus;

export const { add, remove, update } = userSlice.actions;

export default userSlice.reducer;

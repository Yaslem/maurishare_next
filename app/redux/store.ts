import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice";
import postReducer from "./slices/postSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
    },
})
export type RootState = ReturnType<typeof store.getState>
export default store;

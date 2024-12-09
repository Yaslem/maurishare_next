import {createSlice} from '@reduxjs/toolkit';

type UserState = {
    data: {
        id: string,
        name: string,
        username: string,
        email: string,
        role: string,
        createdAt: string,
        photo: string,
        updatedAt: string,
        socialLinks: {
            facebook: string,
            twitter: string,
            instagram: string,
            linkedin: string,
        }
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {},
    } as UserState,
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const userActions = userSlice.actions

export default userSlice.reducer
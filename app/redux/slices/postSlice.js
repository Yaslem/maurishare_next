import {createSlice} from '@reduxjs/toolkit';

export const postSlice = createSlice({
    name: 'post',
    initialState: {
        id: "",
        title: "",
        draft: null,
        action: "create",
        img: "",
        content: "",
        des: "",
        tags: [],

    },
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setDraft: (state, action) => {
            state.draft = action.payload;
        },
        setAction: (state, action) => {
            state.action = action.payload;
        },
        setImg: (state, action) => {
            console.log(action.payload)
            state.img = action.payload;
        },
        setContent: (state, action) => {
            state.content = action.payload;
        },
        setDes: (state, action) => {
            state.des = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        resetPost: (state) => {
            state.title = ""
            state.action = "create"
            state.img = ""
            state.content = ""
            state.des = ""
            state.tags = []
        }
    },
})

export const postActions = postSlice.actions

export default postSlice.reducer
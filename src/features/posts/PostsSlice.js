import {createAsyncThunk} from '@reduxjs/toolkit';
import {createSlice,nanoid} from '@reduxjs/toolkit';
import axios from 'axios';
import {sub} from 'date-fns';

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
    posts:[],
    status:'idle',//'idle' |'loading',|'succeeded'|'failed'
    error:null,
}

 export const fetchPosts =createAsyncThunk('posts/fetchPosts',async()=>{
    try {

        const response = await axios.get(POST_URL);
        // console.log(response.data);
        return [...response.data] 
        // return response.data
       
    } catch (error) {

        return error.message;
        
    }
})

export const addNewPost =createAsyncThunk('posts/addNewPost',async(initialPost)=>{
    try {
        console.log(initialPost)
        const response =await axios.post(POST_URL,initialPost);
        console.log(response.data);
        return response.data;
    } catch (error) {
        return error.message;
    }
})

const postsSlice =createSlice({
    name:'posts',
    initialState,
    
    reducers: {
        postAdded:{
            reducer(state,action){
              state.posts.push(action.payload);
            },
            prepare(title,content,userId){
                return {
                    payload:{
                        id:nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions:{
                            thumbsUp:0,
                            wow:0,
                            heart:0,
                            rocket:0,
                            coffee:0
                        }
                    }

                }

            }
        },
        reactionAdded(state,action){
            const {postId,reaction} = action.payload;
            const existingPost = state.posts.find(post=>post.id === postId);
            if(existingPost){
                existingPost.reactions[reaction]++;
            }
        }
    },
        extraReducers(builder){
            
            builder
            .addCase(fetchPosts.pending,(state,action)=>{
                state.status = 'loading';
            })

            .addCase(fetchPosts.fulfilled,(state,action)=>{
                    state.status ="succeeded";
             //Adding date and reactions

             let min =1;
            //  console.log(action.payload);
             const loadedPosts = action.payload.map(post=>{
                post.date = sub(new Date(),{minutes:min++}).toISOString();
                post.reactions ={
                    thumbsUp:0,
                            wow:0,
                            heart:0,
                            rocket:0,
                            coffee:0
                }
                return post;
             })

             //add any fetchedPosts to the array

            //  state.posts = state.posts.concat(loadedPosts);
             state.posts = loadedPosts;
            //  console.log(state.posts)

            })

            .addCase(fetchPosts.rejected,(state,action)=>{
                state.status ="failed";
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled,(state,action)=>{
                action.payload.userId =Number(action.payload.userId)
                action.payload.date= new Date().toISOString();
                action.payload.reactions={
                    thumbsUp:0,
                            wow:0,
                            heart:0,
                            rocket:0,
                            coffee:0
                }
                console.log(action.payload);
                state.posts.push(action.payload);
            })
        }
    
}) 


export const selectAllPosts = (state)=>state.posts.posts
export const getPostsStatus = (state)=>state.posts.status
export const getPostsError = (state)=>state.posts.error
// we are doing this here becoz if the shape of state ever changes essentially we will just need to change it in the slice and not in every component. 

export const {postAdded,reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;


//It is based on the builder and then we have addCases  for each one of the possibilities here and that is all inside of the extra reducers.So, it is handling something that did not  defined inside of the normal reducers  part  of the slice 
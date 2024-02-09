
import { useState } from "react";
import { useDispatch } from "react-redux";
import {useSelector} from "react-redux";
// import { postAdded } from "./PostsSlice";
import { addNewPost } from "./PostsSlice";
import {selectAllUsers} from "../users/usersSlice";

import React from 'react'

const AddPostForm = () => {
  const dispatch = useDispatch();


    const [title,setTitle] =useState('');

    const [content,setContent] =useState('');

    const [userId,setUserId] = useState('');
    // console.log(userId);
    const[addRequestStatus,setAddRequestStatus]=useState('idle');

    const users =useSelector(selectAllUsers);


    const onTitleChanged = (event)=>setTitle(event.target.value);

    const onContentChanged = (event)=>setContent(event.target.value);

    const onAuthorChanged = (event)=>setUserId(event.target.value)

    // const canSave =Boolean(title) && Boolean(content) && Boolean(userId)
    const canSave= [title,content,userId].every(Boolean) && addRequestStatus === 'idle';

   const onSavePostClick =()=>{
    if(canSave){
      try {
          setAddRequestStatus('pending')
          dispatch(addNewPost({title,body:content,userId})).unwrap();
         
          setTitle('');
          setContent('');
         setUserId('')
      } catch (error) {
        console.error("Failed to save the post",error);
      }finally{
        setAddRequestStatus('idle');
      }
        
    }
   }
   
  const userOptions = users.map((user)=>(
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
   ))
  //  console.log(userOptions)


 return (
    <section>
        <h2>Add a New Post</h2>
        <form>
            <label htmlFor="postTitle">Post Title:</label>
            <input 
            type="text"
            required
            placeholder="write your title here"
            id ="postTitle"
            name ="postTitle"
            value ={title}
            onChange={onTitleChanged}
            />

            <label htmlFor="postAuthor">Author:</label>
            <select
            id="postAuthor"
            value ={userId}
            onChange={onAuthorChanged}
            >
              <option value=""></option>
              {userOptions}
              </select> 
            
            
             

            <label htmlFor="postContent">Post Content:</label>
            <textarea 
            type="text"
            placeholder="write your content here (150 characters)"
            required
            id="postContent"
            name="postContent"
            value ={content}   
            onChange={onContentChanged}
            />
            <button 
            type="button"
            onClick={onSavePostClick}
            disabled ={!canSave}
            >Save Post</button>
        </form>
    </section>
  )
}

export default AddPostForm
/*  Each <option> element has a value attribute set to the id of the user (user.id). Therefore, when an option is selected, event.target.value retrieves the id of the selected user.  */

/* This setup allows you to associate each user's id with the corresponding option in the dropdown menu. When a user selects an option, you get the id of that user, which you can use to identify the author of the post. */
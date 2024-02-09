import {useSelector,useDispatch} from "react-redux";
import React, { useEffect } from 'react'
import {selectAllPosts,getPostsError,getPostsStatus,fetchPosts} from './PostsSlice'
import PostExcerpt from './PostExcerpt';

const PostsList = () => {
    
    const dispatch = useDispatch();

    const posts =useSelector(selectAllPosts);

    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    
   
    // console.log(posts);
    

    useEffect(()=>{
        
        if(postsStatus === 'idle'){
            console.log(postsStatus);
            dispatch(fetchPosts());
        }
    },[postsStatus,dispatch])
    
    
    let content;
    if(postsStatus === 'loading'){
        content = <p>"loading..."</p>;
    } else if(postsStatus === 'succeeded'){ 
   const orderedPosts = posts.slice().sort((a,b)=>b.date.localeCompare(a.date));
content = orderedPosts.map((post)=><PostExcerpt key={post.id} post={post}/>
    )
}
else if(postsStatus ==='failed'){
    
    content = <p>{error}</p>
}
    
return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList


/* useEffect(() => {
        // Check if the postsStatus is 'idle' and no posts are available
        if (postsStatus === 'idle' && posts.length === 0) {
            console.log(postsStatus);
            dispatch(fetchPosts());
        }
    
        // Cleanup function
        return () => {
            // You may perform cleanup actions here if necessary
        };
    }, [postsStatus, dispatch, posts.length]); // Dependency array */

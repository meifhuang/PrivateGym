import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios"; 
import { AuthContext } from "../AuthContext";
import Post from "./Post";


import {
  NewsFeed
} from "../styledComponents/Profile";

export default function Newsfeed({
  //props for POSTS
  handlePostChange,
  postForm,
  handleFileUpload,
  deletePost
}) {

    const navigate = useNavigate();
    const [loggedInId, setLoggedInId] = useState(localStorage.getItem('id'));
    const [prevSlidePosition, setPrevSlidePosition] = useState({});
    const [posts, setPosts] = useState([]); 

    
  const likeAPost = async(postId) => {
    try {
      const response = await axios({
        method: "post",
        url: `http://localhost:4000/likepost/${postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response) {
        console.log(response.data);
        getPosts();
      }
    }
    catch (e) {
      console.log(e.message); 
    }
  }

  const unlikeAPost = async (postId) => {
    console.log("UNLIKEE");
    try {
      const response = await axios({
        method: "delete",
        url: `http://localhost:4000/unlikepost/${postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response) {
        console.log(response.data);
        getPosts();
      }
    }
    catch (e) {
      console.log(e.message);
    }
  }

    
    const getPosts = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "http://localhost:4000/newsfeed/posts",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response) {
          console.log('checking',response.data.posts);
          setPosts(response.data.posts);
          const postIdAndPosition = response.data.posts.map(post => {return ({postId: post._id, index: 0})});
          console.log("postId", postIdAndPosition)
          setPrevSlidePosition(postIdAndPosition);
        }
      }
      catch (e) {
        console.log(e);
      }
    }

    const nextSlide = (imglength, postId) => {
      setPrevSlidePosition(prevSlides => {
        return prevSlides.map(slide => {
          if (slide.postId === postId) {
            if (slide.index === imglength-1) {
              return { ...slide, index: 0 };
            }
            else {
              return {...slide, index: slide.index+1}
            }
          } else {
            return slide;
          }
        });
      });
    console.log('next' , prevSlidePosition);
  }

  const prevSlide = (imglength,postId) => {
      setPrevSlidePosition(prevSlides => {
        return prevSlides.map(slide => {
          if (slide.postId === postId) {
            if (slide.index === 0) {
            return { ...slide, index: imglength-1 };
            }
            else {
              return {...slide, index: slide.index-1}
            }
          } else {
            return slide;
          }
        });
      });
    console.log('prev',prevSlidePosition);
  }

    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    if (token && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('id', userId);
      window.location.replace('http://localhost:5173/newsfeed');
    }
    getPosts(); 
  }, []);
  
const viewProfile = async (userId) => {
    navigate(`/profile/${userId}`);
}

const exploreUsers = async () => {
  navigate('/explore')
}

    return (
           <NewsFeed> 
              <h1> HOME </h1>
            {/* <button onClick={getPosts}> getPosts </button> */}
            <button onClick={exploreUsers}> Explore users</button>
            <button onClick={() => viewProfile(loggedInId)}> Go to my profile </button>
                { posts && posts.map((post) => {
              return (
       
                <Post 
                deletePost={deletePost}
                unlikeAPost={unlikeAPost}
                likeAPost={likeAPost}
                handleFileUpload={handleFileUpload}
                key={post._id}
                post={post}
                nextSlide={nextSlide}
                prevSlide={prevSlide}
                prevSlidePosition={prevSlidePosition}
                loggedInId={loggedInId}
             />
         
              )
              })
            }
            </NewsFeed>
   
    )
}

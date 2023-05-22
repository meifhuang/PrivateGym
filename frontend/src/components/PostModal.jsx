import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

import CommentForm from "./CommentForm";

import { 
  PostModalParentStyle,
  PostModalStyle
} from "../styledComponents/Profile";

 import {
  HeartIcon, 
  UnHeartIcon, 
  DeletePostIcon
} from "../assets/icons";

export default function PostModal({
  loggedInId,
  prevSlidePositionShow,
  posty,
  handleCommentChange,
  commentForm,
  deleteComment,
  createComment,
  nextSlide,
  prevSlide,
  deletePost,
  likeAPost,
  unlikeAPost
}) {
      const [showPost, setShowPost] = useState(true);

      const toggleShowPost = () => {
          setShowPost(false);
      }

        return (
          <>
                    {showPost && 
            <PostModalParentStyle>
            <PostModalStyle>
                <div className="post">
                  <div className="carousel"> 
                      {prevSlidePositionShow.map(slides => {
                        return (
                          slides.postId === posty._id ? <img className="carousel-item carousel-item-visible" src={posty.images[slides.index].url} /> : <> </>
                        )
                      })}
                        {posty.images ? (
                              <div className="carousel-actions">
                                    <button
                                    onClick={() =>
                                        prevSlide(posty.images.length, posty._id)
                                    }
                                    id={`carousel-button-prev`}
                                    aria-label="Previous"
                                    >
                                    {" "}
                                    &lt;{" "}
                                    </button>
                                
                                    <button
                                    onClick={() =>
                                        nextSlide(posty.images.length, posty._id)
                                    }
                                    id={`carousel-button-next`}
                                    aria-label="Next"
                                    >
                                    {" "}
                                    &gt;{" "}
                                    </button>
                                </div>
                            ) : (
                              <div> </div>
                            )}
                        <div className="post-options"> 
                            <div className="likes">
                                { posty && !posty.likedBy.includes(loggedInId) ?
                                <HeartIcon likeAPost={likeAPost} postId={posty._id}/> : 
                                <UnHeartIcon unlikeAPost={unlikeAPost} postId={posty._id}/> }
                                <p> {posty.likedBy.length} likes </p>
                            </div>
                                { posty.createdBy[0]._id === loggedInId ? <DeletePostIcon deletePost={deletePost} postId={posty._id}/> : <></>}
                        </div>
                        <div className="caption"> 
                            <h4> {posty.createdBy[0].fname} {posty.createdBy[0].lname } </h4>
                            <p> {posty.caption} </p>
                        </div>
                        
                        { posty.comments.length > 0 && posty.comments.map((comment) => { 
                      return (
                        <div className="comments"> 
                         <h5> {comment.username} : {comment.description} </h5>
                         <button onClick={() => deleteComment(posty._id, comment._id)}> delete </button>
                        </div> 
                      )
                    })}
                    <CommentForm 
                      handleCommentChange={handleCommentChange}
                      commentForm={commentForm}
                      createComment={createComment}
                      postId={posty._id}
                    /> 

                <button onClick={toggleShowPost }className="closepost"> CLOSE X </button>  
                     
                </div>
               
                </div>
            
                </PostModalStyle>
                </PostModalParentStyle>
                  }
                  </>
              )
                }
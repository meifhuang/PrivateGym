import { useState } from "react";

import {
  WorkoutIcon,
  GridIcon,
  FavoriteIcon,
  DeleteIcon,
  AddIcon,
  CreateWorkoutIcon,
  SaveIcon,
  SavedIcon,
  DeleteSaveIcon,
  HeartIcon, 
  UnHeartIcon
} from "../assets/icons";
import AddPostForm from "./AddPostForm";

//styling

import { PostContainer,
  WorkoutContainer,
  WorkoutDiv,
  WorkoutDivHeader,
  WorkoutButtonContainer,
  WorkoutInfoContainer,
  WorkoutInfo,
  ExerciseInfo,
  ArrowSwitch,
  ExerciseImage } from "../styledComponents/Profile";

import {
  TabBarContainer,
  TabContainer,
  //   Tab,
  TabIconContainer,
  TabButton,
  CreateWorkoutContainer,

} from "../styledComponents/TabBar";
import WorkoutContainerComp from "./WorkoutContainerComp";
const TabBar = ({
  //props for WORKOUTS
  handleExerciseForm,
  workoutName,
  handleNameChange,
  toggleAddWorkoutModal,
  workouts,
  loggedInId,
  id,
  EditIcon,
  clickEditWorkout,
  deleteWorkout,
  saveAWorkout, 
  activeDropdown,
  workoutId,
  savedWorkouts,
  deleteSavedWorkout,
  //props for POSTS
  handlePostChange,
  postForm,
  posts,
  postLikes,
  createPost,
  handleFileUpload,
  user,
  nextSlide,
  prevSlide,
  deletePost,
  likeAPost,
  prevSlidePosition
}) => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <TabBarContainer className="container">
      <TabContainer className="bloc-tabs">
        <TabButton
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          <TabIconContainer>
            <GridIcon />
          </TabIconContainer>
          <div>Posts </div>
        </TabButton>

        <TabButton
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          <TabIconContainer>
            <WorkoutIcon />
          </TabIconContainer>
          <div>Workouts </div>
        </TabButton>

        <TabButton
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          <TabIconContainer>
            <SavedIcon />
          </TabIconContainer>
          <div>Saved</div>
        </TabButton>
      </TabContainer>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <AddPostForm
            handlePostChange={handlePostChange}
            postForm={postForm}
            posts={posts}
            createPost={createPost}
            handleFileUpload={handleFileUpload}
          />
    <PostContainer>
          {posts &&
            posts.map((post,index) => {
              return (
                <div>
                  <div className="carousel"> 
                      {prevSlidePosition.map(slides => {
                        return (
                          slides.postId === post._id ? <img className="carousel-item carousel-item-visible" src={post.images[slides.index].url} /> : <> </>
                        )
                      })}
                  {post.images.length > 1 ? (
                              <div className="carousel-actions">
                                <button
                                  onClick={() =>
                                    prevSlide(post.images.length, post._id)
                                  }
                                  id={`carousel-button-prev`}
                                  aria-label="Previous"
                                >
                                  {" "}
                                  &lt;{" "}
                                </button>
                               
                                <button
                                  onClick={() =>
                                    nextSlide(post.images.length, post._id)
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
                      <HeartIcon likeAPost={likeAPost} postId={post._id}/> <p> {postLikes} likes</p>
                             <h5> {post.caption} </h5>
                  <button onClick={() => deletePost(post._id)}> Delete </button>
                  </div>
                </div>
              );
            })}
          </PostContainer>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <CreateWorkoutContainer className="create-workout">
            {loggedInId === id ? (
              <form onSubmit={(e) => handleExerciseForm(e)}>
                <input
                  type="text"
                  value={workoutName.name}
                  name="name"
                  onChange={handleNameChange}
                  placeholder="Workout Name"
                  size="15"
                  required
                />
                <button
                  // type="button"
                  disabled={!workoutName.name}
                  onClick={toggleAddWorkoutModal}
                  title="Create a Workout"
                >
                  <CreateWorkoutIcon />
                </button>{" "}
              </form>
            ) : (
              ""
            )}
          </CreateWorkoutContainer>
          <WorkoutContainerComp
            workouts={workouts}
            loggedInId={loggedInId}
            id={id}
            EditIcon={EditIcon}
            clickEditWorkout={clickEditWorkout}
            deleteWorkout={deleteWorkout}
            activeDropdown={activeDropdown}
            saveAWorkout={saveAWorkout}
            deleteSavedWorkout={deleteSavedWorkout}
            workoutId={workoutId}
          />
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
           <WorkoutContainer className="workouts">
      {savedWorkouts &&
        savedWorkouts.map((workout) => {
          return (
            <WorkoutDiv className="">
              <WorkoutDivHeader>
                <h1> {workout.name} </h1>
                <WorkoutButtonContainer>
                  <DeleteSaveIcon
                  deleteSavedWorkout={deleteSavedWorkout}
                  workoutId={workout._id}/>
                </WorkoutButtonContainer>
                </WorkoutDivHeader>
              <WorkoutInfoContainer>
                {workout.exercises.map((exercise) => {
                  return (
                    <WorkoutInfo>
                      <ExerciseInfo>
                        <b> {exercise.name}: </b> {exercise.weight} lbs -{" "}
                        {exercise.sets} sets - {exercise.reps} - reps
                        <ArrowSwitch>
                          <svg
                            className={
                              activeDropdown === exercise._id
                                ? "arrow-up feather feather-chevron-down"
                                : "arrow-down feather feather-chevron-down"
                            }
                            onClick={() => {
                              if (activeDropdown === exercise._id) {
                                setActiveDropdown("");
                              } else {
                                setActiveDropdown(exercise._id);
                              }
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            // class="feather feather-chevron-down"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </ArrowSwitch>
                      </ExerciseInfo>

                      <ExerciseImage
                        status={
                          exercise._id === activeDropdown ? "show" : "hide"
                        }
                      >
                        {" "}
                        <img src={exercise.gif} alt="loading..." />
                      </ExerciseImage>
                    </WorkoutInfo>
                  );
                })}
              </WorkoutInfoContainer>
            </WorkoutDiv>
          );
        })}
    </WorkoutContainer>

        </div>
      </div>
    </TabBarContainer>
  );
};

export default TabBar;

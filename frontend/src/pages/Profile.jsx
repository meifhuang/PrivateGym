import { useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
// import workout from "../../backend/models/workout";

//component
import ModalComp from "../components/Modal";
import WorkoutModal from "../components/AddWorkoutForm";

import styled from "styled-components";
import {
  TagInfo,
  UserContact,
  ProfileComp,
  WorkoutContainer,
  WorkoutDiv,
  WorkoutDivHeader,
  WorkoutButtonContainer,
  WorkoutInfoContainer,
  WorkoutInfo,
  Modal,
  ModalOverlay,
} from "../styledComponents/Profile";

export default function Profile() {
  const { id } = useParams();
  const { token, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  function redirectNewsFeed() {
    navigate("/newsfeed");
  }

  const exercises = [
    "bench press",
    "conventional deadlifts",
    "shoulder presses",
    "barbell squats",
    "barbell rows",
  ];

  const stats = {
    name: "",
    weight: 0,
    reps: 0,
    sets: 0,
  };

  const [workoutList, setworkoutList] = useState([]);
  const [username, setUsername] = useState("");
  const [showExerciseForm, setShowExerciseForm] = useState(true);
  const [changeId, setChangeId] = useState("");
  const [exercise, setExercise] = useState(stats);
  const [workoutName, setWorkoutName] = useState({ name: "" });
  const [workoutId, setworkoutId] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editExerciseMode, setEditExerciseMode] = useState(false);
  const [exerciseId, setexerciseId] = useState([]);
  const [loggedInId, setLoggedInId] = useState(localStorage.getItem("id"));
  const [following, setFollowing] = useState([]);

  // const [modal, setModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [workoutModal, setWorkoutModal] = useState(false);

  // if (modal) {
  //   document.body.classList.add("active-modal");
  // } else {
  //   document.body.classList.remove("active-modal");
  // }

  // if (workoutModal) {
  //   document
  //     .querySelector(".workout-modal")
  //     .classList.add("workout-active-modal");
  // } else {
  //   document
  //     .querySelector(".workout-modal")
  //     .classList.remove("workout-active-modal");
  // }

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleWorkoutModal = () => {
    setWorkoutModal(!workoutModal);
  };
  function registerRedirect() {
    navigate("/register");
  }

  const getWorkout = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:4000/profile/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res) {
        // console.log("data", res.data.workouts);
        setUsername(res.data.username);
        setWorkouts(res.data.workouts);
        // console.log("data- following", res.data.loggedInUserFollowing);
        setFollowing(res.data.loggedInUserFollowing);
      } else {
        console.log("no responses");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getWorkout();
  }, []);

  const createWorkout = async () => {
    setWorkoutModal(false);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/createuserworkout",
        data: {
          name: workoutName,
          workoutList: currentWorkout,
          workoutId: workoutId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        console.log("add workout to user");
        setWorkouts(response.data.workouts);
        setworkoutId(response.data.workouts._id);
        setCurrentWorkout([]);
      } else {
        throw Error("No response");
      }
    } catch (e) {
      console.log(e);
    }
    setShowExerciseForm(false);
  };

  const editWorkout = async (workoutId) => {
    setShowExerciseForm(false);
    setEditMode(false);
    setCurrentWorkout([]);
    //alternative to calling this?
    getWorkout();
  };

  const clickEditWorkout = async (workoutId) => {
    setModal(true);
    try {
      const response = await axios({
        method: "get",
        url: `http://localhost:4000/workout/${workoutId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        console.log("edit", response.data.workouts);
        setworkoutId(response.data.workoutId);
        setCurrentWorkout(response.data.workouts);
      } else {
        throw Error("No response");
      }
    } catch (e) {
      console.log(e);
    }
    setEditMode(true);
    setShowExerciseForm(true);
    setexerciseId(0);
  };

  const deleteWorkout = async (workoutId) => {
    try {
      const response = await axios({
        method: "delete",
        url: `http://localhost:4000/workout/${workoutId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        setWorkouts((prev) => {
          return prev.filter(
            (workout) => workout._id !== response.data.workoutId
          );
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const addExercise = async (e) => {
    e.preventDefault();
    try {
      console.log("addeddd exercise");
      const res = await axios({
        method: "put",
        url: `http://localhost:4000/workout/${workoutId}/createexercise`,
        data: {
          name: exercise.name,
          weight: exercise.weight,
          sets: exercise.sets,
          reps: exercise.reps,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res) {
        console.log("adding", res.data.exercise);
        setCurrentWorkout([
          ...currentWorkout,
          {
            _id: res.data.exercise._id,
            name: exercise.name,
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
          },
        ]);
        console.log("whats the workout", currentWorkout);

        // setworkoutList([
        //   ...workoutList,
        //   {
        //     name: exercise.name,
        //     weight: exercise.weight,
        //     sets: exercise.sets,
        //     reps: exercise.reps,
        //   },
        // ]);
      } else {
        console.log("NO RES");
      }
    } catch (e) {
      console.log(e.message);
      console.log(e);
    }
  };

  const handleExerciseForm = async (e) => {
    e.preventDefault();
    setWorkoutModal(true);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/createworkout",
        data: {
          name: workoutName,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        console.log(response.data);
        setworkoutId(response.data.workoutId);
        setCurrentWorkout(currentWorkout);
      } else {
        throw Error("No response");
      }
    } catch (e) {
      console.log(e);
    }
    setShowExerciseForm(true);
    setEditMode(false);
    setEditExerciseMode(false);
  };

  const editExercise = async (e, exerciseId) => {
    e.preventDefault();
    console.log("in exercise route");
    // console.log(exerciseId);
    // console.log(workoutList)
    console.log(editedExercise)
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:4000/workout/${workoutId}/exercise/${exerciseId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          // name: exercise.name,
          // weight: exercise.weight,
          // sets: exercise.sets,
          // reps: exercise.reps,
          name: editedExercise.name,
          weight: editedExercise.weight,
          sets: editedExercise.sets,
          reps: editedExercise.reps,
        },
      });

      if (res) {
        const exercise_data = res.data.finalUpdateExercise;
        const workout = await res.data.updatedWorkouts;
        console.log(currentWorkout);
        // setCurrentWorkout(workout);
        const updateList = currentWorkout.map((exercise) => {
          if (exercise._id === exerciseId) {
            return {
              _id: exerciseId,
              name: exercise_data.name,
              weight: exercise_data.weight,
              sets: exercise_data.sets,
              reps: exercise_data.reps,
            };
          } else {
            return exercise;
          }
        });
        setCurrentWorkout(updateList);
        console.log("return after editing", updateList);
        setExercise(updateList);
        setEditExerciseMode(false);
        setexerciseId(0);
        console.log("whats the current", currentWorkout);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const deleteExercise = async (workoutId, exerciseId) => {
    console.log("in delete route");
    try {
      const res = await axios({
        method: "delete",
        url: `http://localhost:4000/workout/${workoutId}/exercise/${exerciseId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res) {
        setCurrentWorkout((prev) => {
          return prev.filter(
            (exercise) => exercise._id !== res.data.exerciseId
          );
        });
        console.log(currentWorkout);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise({
      ...exercise,
      [name]: value,
    });
  };

  const [editedExerciseName, setEditedExerciseName] = "stats.name";
  const [editedExerciseWeight, setEditedExerciseWeight] = "stats.weight";
  const [editedExerciseReps, setEditedExerciseReps] = "stats.reps";
  const [editedExerciseSets, setEditedExerciseSets] = "10";

  const [editedExercise, setEditedExercise] = useState({
    exercise,
  });

  const handleEditExercise = (e) => {
    const { name, value } = e.target;
    setEditedExercise({
      ...editedExercise,
      [name]: value,
    });
  };

  // {console.log(exercise)}

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setWorkoutName({
      name: value,
    });
    console.log(workoutName);
  };

  function gotoNewsFeed() {
    navigate("/newsfeed");
  }

  const clickEditExercise = async (exerciseId) => {
    try {
      const response = await axios({
        method: "get",
        url: `http://localhost:4000/exercise/${exerciseId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        console.log("in clickEdit Exercise", response.data.exercise);
        setExercise(response.data.exercise);
        setEditedExercise(response.data.exercise)
      } else {
        throw Error("No response");
      }
    } catch (e) {
      console.log(e);
    }
    setEditExerciseMode(true);
    setexerciseId(exerciseId);
    
  };

  const follow = async (id) => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:4000/profile/follow",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          id: id,
        },
      });
      if (res) {
        console.log("FOLLOWED");
        console.log(res.data.following);
        setFollowing(res.data.following);
      } else {
        throw Error("no respones");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const unfollow = async (id) => {
    console.log("in unfollow route");
    try {
      const res = await axios({
        method: "delete",
        url: `http://localhost:4000/profile/${id}/unfollow`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res) {
        console.log("unfollow", res.data.userfollowing);
        setFollowing(res.data.userfollowing);
      } else {
        throw Error("no response");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const logout = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://localhost:4000/logout",
      });
      if (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        // setUsername(null);
        navigate("/");
      } else {
        throw Error("no response");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <ProfileComp>
        <TagInfo className="tag">
          <img src="../src/images/avatar.png"></img>
          <UserContact>
            <h2> {username} </h2>
            <div> @{username}</div>
          </UserContact>

          <form onSubmit={(e) => handleExerciseForm(e)}>
            <label htmlFor="workoutname"> Workout Name </label>
            <input
              type="text"
              value={workoutName.name}
              name="name"
              onChange={handleNameChange}
              required
            />
            <button disabled={!workoutName.name} onClick={toggleWorkoutModal}>
              Create a workout
            </button>
          </form>
          <WorkoutModal
            workoutModal={workoutModal}
            toggleWorkoutModal={toggleWorkoutModal}
            workoutName={workoutName}
            exercise={exercise}
            handleChange={handleChange}
            exercises={exercises}
            editExerciseMode={editExerciseMode}
            currentWorkout={currentWorkout}
            editWorkout={editWorkout}
            createWorkout={createWorkout}
            editMode={editMode}
            addExercise={addExercise}
          />
        </TagInfo>
        <WorkoutContainer className="workouts">
          {workouts &&
            workouts.map((workout) => {
              return (
                <WorkoutDiv className="">
                  <WorkoutDivHeader>
                    <h3> {workout.name} </h3>
                    <WorkoutButtonContainer>
                      <button onClick={() => clickEditWorkout(workout._id)}>
                        {" "}
                        edit workout{" "}
                      </button>
                      <button onClick={() => deleteWorkout(workout._id)}>
                        {" "}
                        delete workout{" "}
                      </button>
                    </WorkoutButtonContainer>
                  </WorkoutDivHeader>
                  <WorkoutInfoContainer>
                    {workout.exercises.map((exercise) => {
                      return (
                        <WorkoutInfo>
                          <p>
                            {exercise.name} - {exercise.weight} lbs -{" "}
                            {exercise.sets} sets - {exercise.reps} - reps
                          </p>
                        </WorkoutInfo>
                      );
                    })}
                  </WorkoutInfoContainer>
                </WorkoutDiv>
              );
            })}
        </WorkoutContainer>
        <div className="about">
          <div className="about-header">About Me</div>
          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum
            soluta quos voluptas repudiandae eaque cum tempora repellat laborum
            officia minima placeat, odit molestiae nihil adipisci perspiciatis
            exercitationem voluptatibus? Vitae, iure.
          </div>
        </div>
        <div className="friends">
          FRIENDS
          {following.map((user) => {
            return <h5> {user.fname}</h5>;
          })}
        </div>
        {/* <form>
          <label htmlFor="name"> Select exercise </label>
          <select
            value={editedExercise.name}
            name="name"
            onChange={handleEditExercise}
            required
          >
            <option value="not chosen"> -- Choose an exercise -- </option>
            <option value="" disabled selected hidden>
              {exercise.name}
            </option>
            {exercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
          <label htmlFor="weight"> Weight </label>
          <input
            type="number"
            value={editedExercise.weight}
            name="weight"
            onChange={handleEditExercise}
            required
          />
          <label htmlFor="sets"> Sets </label>
          <input
            type="number"
            value={editedExercise.sets}
            name="sets"
            onChange={handleEditExercise}
            required
          />
          <label htmlFor="reps"> Reps </label>
          <input
            type="number"
            value={editedExercise.reps}
            name="reps"
            onChange={handleEditExercise}
            required
          />
          <button onClick={() => editExercise(exercise._id)}>
            {" "}
            confirm edit{" "}
          </button>
        </form> */}
      </ProfileComp>

      {modal && (
        <Modal className="">
          <ModalOverlay onClick={toggleModal} className=""></ModalOverlay>
          <div className="modal-content">
            <>
              <h2> {workoutName.name} </h2>
              {/* <form onSubmit={(e) => addExercise(e)}>
                <label htmlFor="name"> Select exercise </label>
                <select
                  value={exercise.name}
                  name="name"
                  onChange={handleChange}
                  required
                >
                  <option value="not chosen"> -- Choose an exercise -- </option>
                  {exercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
                <label htmlFor="weight"> Weight </label>
                <input
                  type="number"
                  value={exercise.weight}
                  name="weight"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="sets"> Sets </label>
                <input
                  type="number"
                  value={exercise.sets}
                  name="sets"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="reps"> Reps </label>
                <input
                  type="number"
                  value={exercise.reps}
                  name="reps"
                  onChange={handleChange}
                  required
                />

                {editExerciseMode ? (
                  <></>
                ) : (
                  <button disabled={!exercise}> Add exercise + </button>
                )}
              </form> */}
              {/* {console.log(editedExercise)} */}
              {currentWorkout &&
                currentWorkout.map((exercise) => {
                  if (exerciseId === exercise._id) {
                    console.log(exercise);
                    return (
                      <form onSubmit={(e) => editExercise(e, exercise._id)}>
                        <label htmlFor="name"> Select exercise </label>
                        <select
                          value={editedExercise.name}
                          name="name"
                          onChange={handleEditExercise}
                          required
                        >
                          <option value="not chosen">
                            {" "}
                            -- Choose an exercise --{" "}
                          </option>
                          <option value="" disabled selected hidden>
                            {exercise.name}
                          </option>
                          {exercises.map((exercise) => (
                            <option key={exercise} value={exercise}>
                              {exercise}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="weight"> Weight </label>
                        <input
                          type="number"
                          value={editedExercise.weight }
                          name="weight"
                          onChange={handleEditExercise}
                          // placeholder={exercise.weight}
                          required
                        />
                        <label htmlFor="sets"> Sets </label>
                        <input
                          type="number"
                          value={editedExercise.sets }
                          name="sets"
                          onChange={handleEditExercise}
                          required
                        />
                        <label htmlFor="reps"> Reps </label>
                        <input
                          type="number"
                          value={editedExercise.reps}
                          name="reps"
                          onChange={handleEditExercise}
                          required
                        />
                        <button
                          type="submit"
                          // onClick={() => editExercise(exercise._id)}
                        >
                          {" "}
                          confirm edit{" "}
                        </button>
                      </form>
                      // <form>
                      //   <label htmlFor="name"> Select exercise </label>
                      //   <select
                      //     value={editedExerciseName}
                      //     name="name"
                      //     onChange={(e)=> setEditedExerciseName(e.target.value)}
                      //     required
                      //   >
                      //     <option value="not chosen">
                      //       {" "}
                      //       -- Choose an exercise --{" "}
                      //     </option>
                      //     <option value="" disabled selected hidden>
                      //       {exercise.name}
                      //     </option>
                      //     {exercises.map((exercise) => (
                      //       <option key={exercise} value={exercise}>
                      //         {exercise}
                      //       </option>
                      //     ))}
                      //   </select>
                      //   <label htmlFor="weight"> Weight </label>
                      //   <input
                      //     type="number"
                      //     value={editedExerciseWeight}
                      //     name="weight"
                      //     onChange={(e)=> setEditedExerciseWeight(e.target.value)}
                      //     required
                      //   />
                      //   <label htmlFor="sets"> Sets </label>
                      //   <input
                      //     type="number"
                      //     value={editedExerciseSets}
                      //     name="sets"
                      //     onChange={(e)=> setEditedExerciseReps(e.target.value)}
                      //     required
                      //   />
                      //   <label htmlFor="reps"> Reps </label>
                      //   <input
                      //     type="number"
                      //     value={editedExerciseReps}
                      //     name="reps"
                      //     onChange={(e)=> setEditedExerciseSets(e.target.value)}
                      //     required
                      //   />
                      //   <button onClick={() => editExercise(exercise._id)}>
                      //     {" "}
                      //     confirm edit{" "}
                      //   </button>
                      // </form>
                    );
                  } else {
                    return (
                      <div>
                        <p>
                          {" "}
                          {exercise.name} : {exercise.weight} lbs -{" "}
                          {exercise.sets} sets - {exercise.reps} reps
                          {editExerciseMode && exercise._id === exerciseId ? (
                            <button onClick={() => editExercise(exercise._id)}>
                              {" "}
                              confirm edit{" "}
                            </button>
                          ) : (
                            <button
                              onClick={() => clickEditExercise(exercise._id)}
                            >
                              {" "}
                              edit{" "}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              deleteExercise(workoutId, exercise._id)
                            }
                          >
                            {" "}
                            delete{" "}
                          </button>
                        </p>
                      </div>
                    );
                  }
                  // return (
                  //   <div>
                  //     <p>
                  //       {" "}
                  //       {exercise.name} : {exercise.weight} lbs -{" "}
                  //       {exercise.sets} sets - {exercise.reps} reps
                  //       {editExerciseMode && exercise._id === exerciseId ? (
                  //         <button onClick={() => editExercise(exercise._id)}>
                  //           {" "}
                  //           confirm edit{" "}
                  //         </button>
                  //       ) : (
                  //         <button
                  //           onClick={() => clickEditExercise(exercise._id)}
                  //         >
                  //           {" "}
                  //           edit{" "}
                  //         </button>
                  //       )}
                  //       <button
                  //         onClick={() =>
                  //           deleteExercise(workoutId, exercise._id)
                  //         }
                  //       >
                  //         {" "}
                  //         delete{" "}
                  //       </button>
                  //     </p>
                  //   </div>
                  // );
                })}
              <button onClick={toggleModal}> Finish editing</button>
              {/* {editMode ? (
                <button onClick={editWorkout}> Finish editing</button>
              ) : (
                <button onClick={createWorkout}> End workout </button>
              )} */}
            </>
          </div>
        </Modal>
      )}
    </div>
  );
}

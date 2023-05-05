import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

//styling
import {
  StyledForm,
  ContainerRow,
  FormContainer,
  FormDiv,
  Image,
  SignupButton,
  GoogleButton,
} from "../styledComponents/SignUp";

//images
import SignupImage from "../images/gym_social_on_phone.png";

export default function Signup() {
  const navigate = useNavigate();

  const [signupPart, setSignupPart] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
    cpassword: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const checkEmail = async (e) => {
    e.preventDefault();
    console.log("CLICKED");
    console.log(values.email);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/emailcheck",
        data: {
          email: values.email,
        },
      });
      if (response) {
        setSignupPart(1);
        setErrorMessage("");
      }
    } catch (e) {
      console.log(e.response.data.message);
      setErrorMessage("Email already exists.");
    }
  };

  const signupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/signup",
        data: {
          fname: values.fname,
          lname: values.lname,
          email: values.email,
          username: values.username,
          password: values.password,
          cpassword: values.cpassword,
        },
      });

      if (response) {
        console.log(response);
        navigate("/login");
      } else {
        throw Error("No response");
      }
    } catch (e) {
      console.log(e.message);
      console.log(e);
      setErrorMessage(e.response.data.message);
    }
  };
  return (
    // <div className="App">
    <ContainerRow>
      {/* <h1> Signup </h1> */}
      {/* <div className="signupContainer"> */}
      <FormContainer>
        <h2>Gym Social</h2>
        <StyledForm
        // onSubmit={signupSubmit}
        >
          <h1>Join the Community!</h1>
          {signupPart === 0 ? (
            <>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="fname">First Name:</label> */}

                <input
                  className="fadeout"
                  type="text"
                  id="fname"
                  name="fname"
                  value={values.fname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
              </FormDiv>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="lname">Last Name:</label> */}
                <input
                  className="fadeout"
                  type="text"
                  id="lname"
                  name="lname"
                  value={values.lname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </FormDiv>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="email">Email Address:</label> */}
                <input
                  className="fadeout"
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </FormDiv>
            </>
          ) : (
            <>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="username">Username:</label> */}
                <input
                  className="slide-left"
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </FormDiv>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="password">Password:</label> */}
                <input
                  className="slide-left"
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
              </FormDiv>
              <FormDiv signupPart={signupPart}>
                {/* <label htmlFor="cpassword">Confirm Password:</label> */}
                <input
                  className="slide-left"
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  value={values.cpassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                />
              </FormDiv>
            </>
          )}
          <div>{errorMessage}</div>
          <SignupButton
            onClick={(e) => {
              signupPart === 0 ? checkEmail(e) : signupSubmit(e);
            }}
          >
            Create Account{" "}
            {signupPart === 0 && (
              <span>
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="css-i6dzq1"
                >
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </span>
            )}
          </SignupButton>
          <GoogleButton>Sign up with Google</GoogleButton>
        </StyledForm>
      </FormContainer>
      {/* <div> */}
      <Image src={SignupImage} alt="loading" />

      {/* </div> */}
    </ContainerRow>
  );
}
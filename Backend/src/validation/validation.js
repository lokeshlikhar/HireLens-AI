import validator from "validator";

const validateSignUp = (req) => {
  //validate req.body
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    //check if anything is undefined
    throw new Error("Please provide username , email , password ");
  } else if (!validator.isEmail(email)) {
    //check for email
    throw new Error("Please provide correct email");
  } else if (!validator.isStrongPassword(password)) {
    //check password is strong or not
    throw new Error("Please provide Strong Password");
  } else if (username.length < 4 || username.length > 12) {
    //check username length
    throw new Error("username is invalid");
  } else if (password.length < 6 || password.length > 200) {
    //check password length
    throw new Error("password is invalid");
  } else if (email.length < 3 || email.length > 25) {
    throw new Error("email should be valid");
  }
};
export { validateSignUp };

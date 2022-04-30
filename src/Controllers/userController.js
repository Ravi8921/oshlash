const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10
const userModel = require("../Models/userModel");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const validator = require("../validation/validator");


const RegisterUser = async (req, res) => {
  try {
    let data = req.body;

    const { fname, lname, email, phone, password } = data;

    if (!validator.isValidRequestBody(data)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request  Please Provide User Details",
        });
    }

    if (!validator.isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide first Name" });
    }

    if (!validator.isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide last Name" });
    }

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide email" });
    }
    const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property 
    if (isEmailAlreadyUsed) {
      res.status(400).send({ status: false, message: `${email} email address is already registered` })
      return
    }

    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid PhoneNo" });
    }
    const isPhoneNumberAlreadyUsed = await userModel.findOne({ phone: phone });
    if (isPhoneNumberAlreadyUsed) {
      res.status(400).send({ status: false, message: `${phone} mobile number is already registered`, });
      return;
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Password " });
    }
    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, message: `${password} invalid` })
      return
    }
    if (!(password.trim().length > 7 && password.trim().length < 16)) {
      res.status(400).send({ status: false, message: `${password} invalid` })
      return
    }



    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      return res
        .status(400)
        .send({ status: false, message: `Enter a valid email address` });
    }

    if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gi.test(phone.trim())) {
      return res.status(400).send({
        status: false,
        message: "Phone should be a valid number",
      });
    }


    // generate salt to hash password

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // now we set user password to hashed password
    data.password = await bcrypt.hash(password, encryptedPassword);
    const savedData = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "Successfully Created", data: savedData });


  }

  catch (err) {
    return res.status(500).send({ status: false, "message": err.message })
  }

}

const Login = async (req, res) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;

    if (!Email || (typeof Email === 'string' && Email.trim().length === 0)) {
      return res.status(400).send({ status: false, message: "Email is required" })
    }

    if (!Password || (typeof Password === 'string' && Password.trim().length === 0)) {
      return res.status(400).send({ status: false, message: `Password is required` })
    }

    let user = await userModel.findOne({ email: Email });
    if (user) {

      const _id = user._id
      const name = user.fname
      const password = user.password

      const validPassword = await bcrypt.compare(Password, password);

      if (!validPassword) { return res.status(400).send({ status: false, message: " Invalid password" }); }
      let payload = { userId: _id };
      const generatedToken = jwt.sign(payload, "ravikant", { expiresIn: "60m" });

      res.header("user-login", generatedToken);

      return res
        .status(200).send({
          status: true, message: name + ", You have  logged in successfully",
          userId: _id,
          token: generatedToken,
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


const Logout = async (req, res) => {
  try {

    let email = req.body.email
    let password = req.body.password
    if (email && password) {

      let User = await userModel.findOne({ email: email })
      const token = jwt.sign({ userId: User._id, exp: Math.floor(Date.now() / 1000) + 30 * 60 }, "pk")
    
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_TOKEN),
      httpOnly: true,
    })
    res.clearCookie('jwt')
    res.clearCookie('user')

    res.header('x-api-key', token)

    res.status(200).send({ status: true, msg: "User logout successfull", data: { userId: User._id, token: "ravikant" } })
  }
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }

};
module.exports.RegisterUser = RegisterUser;
module.exports.Login = Login
module.exports.Logout = Logout
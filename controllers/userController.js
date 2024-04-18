import user from "../model/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, mobileNo, password, userType } = req.body;
  const checkEmail = await user.findOne({ email: email });
  if (checkEmail) {
    res.send({ msg: "Email aleardy Exist", status: "Failed" });
  } else if (email && password && name) {
    try {
      let hashpassword = await bcrypt.hash(password, 10);
      const data = await user.create({
        name: name,
        email: email,
        mobileNo: mobileNo,
        userType: userType,
        password: hashpassword,
      });
      console.log(data);
      res.send({ msg: "Sucessfully Registetred", status: "ok", data });
    } catch (error) {
      res.send({ msg: "User is Not Registered" });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const data = await user.findOne({ email: email });
      if (data && (await bcrypt.compare(password, data.password))) {
        const accessToken = Jwt.sign(
          { _id: data._id, role: data.userType },
          process.env.Access_Token,
          { expiresIn: "2m" }
        );
        // const updateuser = await user.findByIdAndUpdate(data.id, {
        //   accessToken: accessToken,
        // });

        res.json({
          _id: data._id,
          name: data.name,
          email: data.email,
          mobileNo: data.mobileNo,
          accessToken: accessToken,
        });
      } else {
        res.status(404).json({ msg: "Email && Password is not valid", status: 404 });
      }
    } else {
      res.status(404).json({ msg: "Email && Password is not found", status: 404 });
    }
  } catch (error) {
    res.send(error);
    res.send({ msg: "Internal Eerver Error", status: 500 });

  }
};

// const logOut = async (req, res) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res
//         .status(400)
//         .json({ msg: "No access token provided", status: "failed" });
//     }
//     console.log({ accessToken: token });
//     const userRecord = await user.findOne({ accessToken: token });
//     console.log(userRecord);

//     if (!userRecord) {
//       return res.status(404).json({ msg: "User not found", status: "failed" });
//     }

//     await user.findOneAndUpdate({ accessToken: "" });

//     return res.status(200).json({ msg: "Logout successful", status: "ok" });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ msg: "Error occurred while logging out", status: "failed" });
//   }
// };

const updateUserPassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.send({
        msg: "userId, currentPassword, and newPassword are required",
        status: "failed",
      });
    }
    const userData = await user.findById(userId);
    if (!userData) {
      return res.send({
        msg: "User not found",
        status: "failed",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, userData.password);

    if (!passwordMatch) {
      return res.send({
        msg: "Current password is incorrect",
        status: "failed",
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserData = await user.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    res.send({
      msg: "Password updated successfully",
      status: "success",
    });
  } catch (error) {
    res.send(error);
  }
};

const generateRefreshToken = async (req, res) => {
  const { accessToken } = req.body;
  console.log(accessToken);
  if (!accessToken) return null;
  try {
    const decoded = Jwt.verify(accessToken, process.env.Access_Token);
    console.log(decoded);
    const newAccessToken = Jwt.sign({ userID: decoded.userId }, process.env.Access_Token, { expiresIn: '7m' });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'unauthorized' });
  }
};


const adduser = async (req, res) => {
  const { name, email, mobileNo, password } = req.body
  try {
    const data = await user.create({ name: name, email: email, mobileNo: mobileNo, password: password })
    console.log(data)
    res.status(200).json({ data: data, msg: "user created sucessfully", status: 200 })
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
}

const getUser = async (req, res) => {
  try {
    const data = await user.find()
    res.status(200).json({ data: data, msg: "user created sucessfully", status: 200 })
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
}

const editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, mobileNo, password } = req.body
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found", status: 404 });
    }
      const data = await user.findByIdAndUpdate(userId, { name, email, mobileNo, password }, { new: true })
      console.log(data)
      res.status(200).json({ data: data, msg: "user created sucessfully", status: 200 })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "internal server error" });
  }
}

const deleteuser = async (req, res) => {
  const { userId } = req.params
  console.log(userId)
  try {
    if (userId) {
      const data = await user.findByIdAndDelete(userId)
      console.log(data)
    }
    res.status(200).json({ msg: "Data delete sucessfully", data: data });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "internal server error" });
  }
}

export {
  registerUser,
  loginUser,
  updateUserPassword,
  generateRefreshToken,
  adduser,
  deleteuser,
  getUser,
  editUser
};

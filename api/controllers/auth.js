import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Prepare user data for insertion based on alumniFlag
    const alumniFields = req.body.alumniFlag
      ? [req.body.company, req.body.position, req.body.gradYear]
      : [null, null, null]; // Null for non-alumni

    const studentFields = req.body.alumniFlag
      ? [null, null]
      : [req.body.dept, req.body.enrollmentYear]; // Fields for students

    const q = `
      INSERT INTO users
      (username, email, password, name, dept, enrollmentYear, company, position, gradYear, alumniFlag)
      VALUES (?)`;

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      ...studentFields, // dept, enrollmentYear for students
      ...alumniFields, // company, position, gradYear for alumni
      req.body.alumniFlag, // Alumni flag
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};


export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};

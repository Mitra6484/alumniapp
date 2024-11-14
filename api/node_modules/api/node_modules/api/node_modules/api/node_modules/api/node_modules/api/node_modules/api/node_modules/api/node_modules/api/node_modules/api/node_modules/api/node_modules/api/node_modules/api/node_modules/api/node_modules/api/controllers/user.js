import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q = "";
    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
    ];

    if (req.body.alumniFlag) {
      q = "UPDATE users SET `name`=?,`city`=?,`website`=?,`coverPic`=?,`profilePic`=?, `company`=?, `position`=?, `gradYear`=? WHERE id=?";
      values.push(req.body.company, req.body.position, req.body.gradYear);
    } else {
      q = "UPDATE users SET `name`=?,`city`=?,`website`=?,`coverPic`=?,`profilePic`=?, `dept`=?, `enrollmentYear`=? WHERE id=?";
      values.push(req.body.dept, req.body.enrollmentYear);
    }

    values.push(userInfo.id);  // user ID at the end

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your profile!");
    });
  });
};


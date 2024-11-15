import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
    ...(user.alumniFlag
      ? { company: user.company, position: user.position, gradYear: user.gradYear }
      : { dept: user.dept, enrollmentYear: user.enrollmentYear }),
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    let coverUrl = cover ? await upload(cover) : user.coverPic;
    let profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            {/* Cover Picture */}
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : "/upload/" + user.coverPic}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file" id="cover" style={{ display: "none" }} onChange={(e) => setCover(e.target.files[0])} />

            {/* Profile Picture */}
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : "/upload/" + user.profilePic}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file" id="profile" style={{ display: "none" }} onChange={(e) => setProfile(e.target.files[0])} />
          </div>

          {/* User Info */}
          <label>Email</label>
          <input type="text" value={texts.email} name="email" onChange={handleChange} />
          <label>Password</label>
          <input type="text" value={texts.password} name="password" onChange={handleChange} />
          <label>Name</label>
          <input type="text" value={texts.name} name="name" onChange={handleChange} />
          <label>Country / City</label>
          <input type="text" name="city" value={texts.city} onChange={handleChange} />
          <label>Website</label>
          <input type="text" name="website" value={texts.website} onChange={handleChange} />

          {/* Alumni or Student Info */}
          {user.alumniFlag ? (
            <>
              <label>Company</label>
              <input type="text" name="company" value={texts.company} onChange={handleChange} />
              <label>Position</label>
              <input type="text" name="position" value={texts.position} onChange={handleChange} />
              <label>Graduation Year</label>
              <input type="text" name="gradYear" value={texts.gradYear} onChange={handleChange} />
            </>
          ) : (
            <>
              <label>Department</label>
              <input type="text" name="dept" value={texts.dept} onChange={handleChange} />
              <label>Enrollment Year</label>
              <input type="text" name="enrollmentYear" value={texts.enrollmentYear} onChange={handleChange} />
            </>
          )}

          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./followers.scss";

const FollowersAndFollowings = () => {
  const { userId } = useParams();  // Fetch the userId from the URL
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // Fetch followers
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        // Use absolute path
        const res = await axios.get(`https://alumniapp-server.vercel.app/relationships/${userId}/followers`);
        setFollowers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch followings
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(`https://alumniapp-server.vercel.app/relationships/${userId}/followings`);
        setFollowings(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFollowers();
    fetchFollowings();
  }, [userId]);

  return (
    <div className="followers-and-followings">
      {/* Followers Section */}
      <div className="followers">
        <h2>Followers</h2>
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div key={follower.id} className="user-card">
              <img src={`/upload/${follower.profilePic}`} alt={follower.username} />
              <span>{follower.username}</span>
            </div>
          ))
        ) : (
          <p>No followers found.</p>
        )}
      </div>

      {/* Followings Section */}
      <div className="followings">
        <h2>Following</h2>
        {followings.length > 0 ? (
          followings.map((following) => (
            <div key={following.id} className="user-card">
              <img src={`/upload/${following.profilePic}`} alt={following.username} />
              <span>{following.username}</span>
            </div>
          ))
        ) : (
          <p>Not following anyone.</p>
        )}
      </div>
    </div>
  );
};

export default FollowersAndFollowings;

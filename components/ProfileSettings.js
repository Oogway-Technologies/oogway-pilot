import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { db } from "../firebase";

function ProfileSettings({ userProfile }) {
  const router = useRouter();
  const [dm, setDm] = useState(userProfile.allowDM);
  const [username, setUsername] = useState(userProfile.username);
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const toggleDM = (e) => {
    e.preventDefault();
    setDm(!dm);
  };

  const saveAndContinue = (e) => {
    e.preventDefault();

    // Set the profile and continue
    db.collection("profiles")
      .doc(userProfile.uid)
      .get()
      .then((doc) => {
        let tmp = doc.data();
        tmp.resetProfile = false;
        tmp.bio = bio ? bio : "";
        tmp.lastName = last ? last : "";
        tmp.location = location ? location : "";
        tmp.name = name ? name : "";
        // TODO -> ADD THE LOGIC TO UPLOAD PICTURE AS PER POST
        // tmp.profilePic = "";
        tmp.username = username ? username : "";
        tmp.allowDM = dm;

        doc.ref.update(tmp);

        // After update push the router to the feed
        router.push(`/feed/${userProfile.uid}`);
      });
  };

  const cancelAndContinue = (e) => {
    e.preventDefault();

    // Set the profile so that it doesn't need reset
    db.collection("profiles")
      .doc(userProfile.uid)
      .get()
      .then((doc) => {
        let tmp = doc.data();
        tmp.resetProfile = false;
        doc.ref.update(tmp);

        // After update push the router to the feed
        router.push(`/feed/${userProfile.uid}`);
      });
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <Head>
        <title>Profile settings</title>
      </Head>
      <h1 className="mt-5">User Profile settings</h1>
      <div className="flex w-1/2 mt-10 items-center justify-center">
        <Image
          className="top-0"
          src={userProfile.profilePic}
          height={84}
          width={84}
        />
        <form className="flex flex-grow flex-col items-center">
          <p>Username</p>
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            className="flex-grow w-full p-2 ml-5 rounded-md focus:outline-none"
            type="text"
          />
          <div className="flex ml-3">
            <div className="flex flex-col items-center">
              <p className="mt-3">First name</p>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className="p-2 w-4/5 rounded-md focus:outline-none"
                type="text"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="mt-3">Last name</p>
              <input
                onChange={(e) => {
                  setLast(e.target.value);
                }}
                value={last}
                className="p-2 w-4/5 rounded-md focus:outline-none"
                type="text"
              />
            </div>
          </div>
          <p className="mt-3">Location</p>
          <input
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            value={location}
            className="flex-grow w-full p-2 ml-5 rounded-md focus:outline-none"
            placeholder={"Wonderland"}
            type="text"
          />
          <p className="mt-3">Bio</p>
          <input
            onChange={(e) => {
              setBio(e.target.value);
            }}
            value={bio}
            className="flex-grow w-full p-2 ml-5 rounded-md focus:outline-none"
            placeholder={"Something about yourself..."}
            type="text"
          />
          <div className="flex items-center">
            <button className="btn mt-3" onClick={toggleDM}>
              Allow DM
            </button>
            {dm ? (
              <p className="mt-3 ml-3">DM enabled</p>
            ) : (
              <p className="mt-3 ml-3">DM disabled</p>
            )}
          </div>
          <div className="flex items-center">
            <button className="btn mt-3 mr-3" onClick={cancelAndContinue}>
              Cancel
            </button>
            <button className="btn mt-3" onClick={saveAndContinue}>
              Save and continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;

import { useState } from "react";
import Head from "next/head";
import Modal from "../components/Utils/Modal";
import LoginForm from "../components/Login/LoginForm";
import { loginDivs } from "../styles/login";

function Login() {
  const [isOpen, setIsOpen] = useState(false);

  // Modal helper functions
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={loginDivs.container}>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <button onClick={openModal}>Login</button>
      </div>
      <img
        className={loginDivs.logo}
        src='https://cdn-icons-png.flaticon.com/512/2395/2395608.png'
      />
      <Modal
        children={<LoginForm closeModal={closeModal} />}
        show={isOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default Login;

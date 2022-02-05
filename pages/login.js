import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import Modal from "../components/Utils/Modal";
import LoginForm from "../components/Login/LoginForm";

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
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <button onClick={openModal}>Login</button>
      </div>
      <Logo src="https://cdn-icons-png.flaticon.com/512/2395/2395608.png" />
      <Modal
        children={<LoginForm closeModal={closeModal} />}
        show={isOpen}
        onClose={closeModal}
      />
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;

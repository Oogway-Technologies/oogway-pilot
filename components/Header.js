import { Avatar, Button, IconButton } from '@mui/material';
import styled from 'styled-components';
import {auth} from '../firebase';

function Header() {
    return (
        <Container>
            <UserAvatar src={"https://cdn-icons-png.flaticon.com/512/2395/2395608.png"} onClick={() => auth.signOut()}/>
            <Message>Click on the avatar to sign out</Message>
        </Container>
    )
}

export default Header

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const Message = styled.h1`
    margin-left: 10px;
`;

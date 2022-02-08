import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const { userId } = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        if(user){
            if(user.id !== userId){
                navigate(`/useraccount/${user.id}`)
            }
        } else {
            navigate(`/login`)
        }
    })

    const accountPage = user.id === userId ? (
        <Title>Hello {user.username}</Title>
    ) :
    (
        <Title>You are not authorized to view this page</Title>
    )

  return accountPage
};

export default MyAccount;

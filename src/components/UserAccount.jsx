import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const UserAccount = () => {
  const { userId } = useParams();

  return (
    <Title>You are viewing {userId}'s account</Title>
  )
};

export default UserAccount;

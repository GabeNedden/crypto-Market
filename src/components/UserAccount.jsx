import React, { useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { AuthContext } from '../context/auth';
import { Typography } from 'antd';

const { Title } = Typography;

const UserAccount = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  let navigate = useNavigate();

  useEffect(() => {
      if(!user){
          navigate(`/login`)
      }
  })

  const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, { variables: { userId }});
  console.log(getUser)

  return (
    <Title>You are viewing {getUser.username}'s account</Title>
  )
};

const FETCH_USER_QUERY = gql `
  query($userId: String) {
  getUser(input: $userId) {
    id
    email
    createdAt
    username
    portfolio {
      name
      quantity
    }
  }
}
`

export default UserAccount;

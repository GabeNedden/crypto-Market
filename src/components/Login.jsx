import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Form, Input, Button } from 'antd';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';

const Login = () => {
  const context = useContext(AuthContext)

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
    console.log(values)
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, {data: { login: userData}}) {
      context.login(userData)
      routeChange();
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });



  const onSubmit = () => {
    loginUser();
  };


  return (

<div className='form-container'>
  <Form
    className='form'
    name="login"
    onFinish={onSubmit}
    scrollToFirstError
  >

  <Form.Item
    name="nickname"
    label="Nickname"
    value={values.username}
    onChange={onChange}
    tooltip="yes, it's case-senstitive"
    rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
  >
    <Input name='username'/>
  </Form.Item>

  <Form.Item
    name="password"
    label="Password"
    value={values.password}
    onChange={onChange}
    rules={[
      {
        required: true,
        message: 'Please input your password!',
      },
    ]}
    hasFeedback
  >
    <Input.Password name='password'/>
  </Form.Item>

  <Form.Item >
    <Button loading={loading} type="primary" htmlType="submit">
      Login
    </Button>
  </Form.Item>

  {Object.keys(errors).length > 0 &&(
      <Alert
      message="Error"
      description={Object.values(errors)}
      type="error"
      showIcon
    />
    )}

</Form>
</div>

  )
};

const LOGIN_USER = gql`
mutation login(
  $username: String!
  $password: String!
) {
  login(
    username: $username password: $password
  ) {
    id
    email
    username
    token
  }
}
`

export default Login;

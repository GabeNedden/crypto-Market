import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Form, Input, Checkbox, Button } from 'antd';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';

const Register = () => {
  const context = useContext(AuthContext)

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, {data: {register: userData}}){
      context.login(userData)
      routeChange();
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  const onSubmit = (e) => {
    addUser();
  };


  return (

  <div className='form-container'>
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout='vertical'
      form={form}
      name="register"
      onFinish={onSubmit}
      initialValues={{}}
      scrollToFirstError
    >

    <Form.Item
      name="nickname"
      label="Nickname"
      value={values.username}
      onChange={onChange}
      tooltip="What do you want others to call you?"
      rules={[
        { required: true, message: 'Please input your nickname!', whitespace: true },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if ( value.length < 16) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Nickname cannot exceed 16 characters'));
          },
        }),
      ]}

    >
      <Input name='username' />
    </Form.Item>

    <Form.Item
      name="email"
      label="E-mail"
      value={values.email}
      onChange={onChange}
      rules={[
        {
          type: 'email',
          message: 'The input is not valid E-mail!',
        },
        {
          required: true,
          message: 'Please input your E-mail!',
        },
      ]}
    >
      <Input name='email'/>
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

    <Form.Item
      name="confirmPassword"
      label="Confirm Password"
      value={values.confirmPassword}
      onChange={onChange}
      dependencies={['password']}
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please confirm your password!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
          }
        })
      ]}
    >
      <Input.Password name='confirmPassword'/>
    </Form.Item>

    <Form.Item
      name="agreement"
      valuePropName="checked"
      rules={[
        {
          validator: (_, value) =>
            value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
        },
      ]}

    >
      <Checkbox>
        I have read the <a href="/">agreement</a>
      </Checkbox>
    </Form.Item>

    <Form.Item >
      <Button loading={loading} type="primary" htmlType="submit">
        Register
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

const REGISTER_USER = gql`
        mutation register(
            $username: String!
            $email: String!
            $password: String!
            $confirmPassword: String!
        ) {
            register(
                registerInput: {
                    username: $username
                    email: $email
                    password: $password
                    confirmPassword: $confirmPassword
                }
            ){
                id
                email
                username
                createdAt
                cash
                portfolio{
                  name
                  symbol
                  quantity
                }
                token
            }
        }
    `

export default Register;

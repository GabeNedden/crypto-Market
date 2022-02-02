import React, { useState } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';


const Register = () => {

  const [form] = Form.useForm();

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
    update(proxy, result){
      console.log(result)
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
      className='form'
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
      rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
    >
      <Input />
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
      <Input />
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
      <Input.Password />
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
          },
        }),
      ]}
    >
      <Input.Password />
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
      <Button type="primary" htmlType="submit">
        Register
      </Button>
    </Form.Item>

  </Form>
  </div>

    )
};

const REGISTER_USER = gql`
  mutation register (
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
      username
      email
      token
    }
  }
    
  
`

export default Register;

import React from 'react';
import { Form, Input, Button } from 'antd';

const Login = () => {

  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };


  return (

<div className='form-container'>
  <Form
    className='form'

    form={form}
    name="login"
    onFinish={onFinish}
    initialValues={{}}
    scrollToFirstError
  >

  <Form.Item
    name="nickname"
    label="Nickname"
    tooltip="What do you want others to call you?"
    rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="password"
    label="Password"
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

  <Form.Item >
    <Button type="primary" htmlType="submit">
      Login
    </Button>
  </Form.Item>

</Form>
</div>

  )
};

export default Login;

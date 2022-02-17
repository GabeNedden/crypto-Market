import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/auth';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Avatar, Button, Col, Drawer, Divider, Form, Input, Radio, Row, Typography } from 'antd';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import {  DollarOutlined, MinusCircleOutlined, PicLeftOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons'
import Loader from './Loader';
import MyInput from './MyInput';

const BuySellDrawer = (props) => {
    const { user } = useContext(AuthContext);
    const userId = user.id;
    const coinId = props.crypto[0].uuid;
    const userDetails = props.userDetails;
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const cryptoDetails = data?.data?.coin;
    const [form] = Form.useForm();

    const [ visible, setVisible ] = useState(false);
    const onClose = () => setVisible(false);
    
    const [values, setValues] = useState({
        action: '',
        price: '',
        quantity: '',
        cash: '20000'
    });

    const onChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    };

    const [updatePortfolio] = useMutation(UPDATE_PORTFOLIO_MUTATION, {
        variables: {
            userId: userId,
            cash: values.cash,
            quantity: values.quantity,
            name: props.portfolio.name,
            symbol: props.portfolio.symbol,
            averagePrice: props.portfolio.averagePrice
        }
      });

      const onSubmit = (e) => {
        updatePortfolio()
    }

  if (isFetching) return <Loader />;
  

  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );

  return (
    <>
        <Button type={props.buttonType} onClick={() => setVisible(true)}>
          {props.title}
        </Button>

        <Drawer
          width={320}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <Typography.Title className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
            {cryptoDetails.name}
          </Typography.Title>
          <p className="site-description-item-profile-p">Crypto Details</p>
          <Row>
            <Col span={24}>
              <DescriptionItem title="Current Price" content={parseFloat(cryptoDetails.price).toFixed(2)} />
            </Col>
            <Col span={24}>
              <DescriptionItem title="Change" content={`${cryptoDetails.change}%`} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title="All Time High" content={parseFloat(cryptoDetails.allTimeHigh.price).toFixed(2)} />
            </Col>
            <Col span={24}>
              <DescriptionItem title="Symbol" content={cryptoDetails.symbol} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title="IPO Date" content='Info available soon' />
            </Col>
            <Col span={24}>
              <DescriptionItem title="Website" content={<a href={cryptoDetails.websiteUrl}>{cryptoDetails.websiteUrl}</a>} />
            </Col>
          </Row>
          <Row>

          <Divider />
            <div className="form-container">
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    layout='vertical'
                    form={form}
                    name="order"
                    onFinish={onSubmit}
                    initialValues={{price: parseFloat(cryptoDetails.price).toFixed(2), cash: userDetails.cash}}
                    scrollToFirstError
                    style={{width: '100%'}}
                    >

                    <Form.Item
                    
                    >
                    <Radio.Group value={values.action} name='action' onChange={onChange} defaultValue={props.title} buttonStyle="solid">
                        <Radio.Button value='Buy'>
                            Buy
                        </Radio.Button>
                        <Radio.Button value='Sell'>
                            Sell
                        </Radio.Button>
                    </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        value={values.price}
                        onChange={onChange}
                        onClick={onChange}
                        tooltip="Beware the delay from the Coinranking API"
                    >
                    <Input 
                        addonBefore={<DollarOutlined />}
                        name='price' 
                        style={{width: '100%'}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        value={values.quantity}
                        onChange={onChange}
                    >
                    <Input 
                        name='quantity'
                        addonBefore={values.action == 'Buy' ? <PlusCircleOutlined /> : <MinusCircleOutlined />}
                        style={{width: '100%'}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="cash"
                        label="Spending $"
                    >
                    <Input 
                        addonBefore={<UserOutlined />}
                        disabled
                        prefix='$'
                        name='cash'
                        style={{width: '100%'}}
                    />
                    </Form.Item>

                    <Form.Item >
                    <Button 
                    loading={isFetching}
                    type="primary"
                    htmlType="submit"
                    style={{width: '100%'}}
                    >
                        Confirm Order
                    </Button>
                    </Form.Item>

                </Form>
            </div>

          </Row>
        </Drawer>
      </>
  )
}

const UPDATE_PORTFOLIO_MUTATION = gql `
        mutation updatePortfolio(
          $userId: ID!
          $cash: String
          $name: String
          $symbol: String
          $quantity: String
          $averagePrice: String
          ) {
          updatePortfolio(
            userId: $userId
            cash: $cash
            stockInput: {
              name: $name
              symbol: $symbol
              quantity: $quantity
              averagePrice: $averagePrice
            }
            ) {
            username
            cash
            portfolio {
              name
              symbol
              quantity
              averagePrice
            }
          }
        }
      `

export default BuySellDrawer
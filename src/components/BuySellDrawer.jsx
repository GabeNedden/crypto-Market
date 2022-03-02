import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/auth';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Col, Drawer, Divider, Form, Input, Modal, Radio, Result, Row, Typography } from 'antd';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import {  DollarOutlined, MinusCircleOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons'
import Loader from './Loader';

const BuySellDrawer = (props) => {
    const { user } = useContext(AuthContext);
    const userId = user.id;
    const coinId = props.crypto[0].uuid;
    const userDetails = props.userDetails;
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const cryptoDetails = data?.data?.coin;
    const [form] = Form.useForm();

    const [ visible, setVisible ] = useState(false);
    const [ modal, setModal ] = useState(false)
    const [ errors, setErrors ] = useState({});
    const onClose = () => setVisible(false);
    
    const [values, setValues] = useState({
        action: props.title,
        price: props.crypto[0].price,
        quantity: ''
    });

    const onChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    };

    const [updatePortfolio] = useMutation(UPDATE_PORTFOLIO_MUTATION, {
        variables: {
            userId: userId,
            action: values.action,
            name: props.portfolio.name,
            symbol: props.portfolio.symbol,
            quantity: values.quantity,
            price: values.price
        },
        onError(err){
          setErrors(err.graphQLErrors[0].message);
          console.log(errors)
        }
      });

      const onSubmit = (e) => {
        updatePortfolio();
        setVisible(false);
        setModal(true)
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
        <Modal
          title="Market Order Status"
          centered
          visible={modal}
          onOk={() => window.location.reload()}
          onCancel={() => window.location.reload()}
          width={1000}
          footer={null}
        >
          <Result
            status={errors.length > 0 ? 'warning' : 'success'}
            title={errors.length > 0 ? `${errors}` : `Successful ${values.action === "Buy" ? "purchase" : "sale"} of ${values.quantity} ${values.quantity > 1 ? 'shares' : 'share'} of ${props.portfolio.name}`}
            subTitle="Order number: 2017182818828182881 Keep this order number for your records"
            extra={[
              <Button type="primary" key="console" onClick={() => window.location.reload()}>
                OK
              </Button>
            ]}
          />
        </Modal>

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
                    initialValues={{
                        price: parseFloat(cryptoDetails.price).toFixed(2), 
                        cash: userDetails.cash,
                        action: props.title
                    }}
                    scrollToFirstError
                    style={{width: '100%'}}
                    >

                    <Form.Item
                        name='action'
                        label='Price'
                        value={values.price}
                        onChange={onChange}
                    >
                    <Radio.Group value={values.action} name='action' onChange={onChange} buttonStyle="solid">
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
                        rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (parseFloat(getFieldValue('price')) >= parseFloat(cryptoDetails.price).toFixed(2)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Sorry, the price of ${cryptoDetails.name} is ${parseFloat(cryptoDetails.price).toFixed(2)}`));
                              },
                            })
                        ]}
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
                        rules={[
                          { required: true, message: '', whitespace: true },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if ( value > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('Please input quantity greater than 0'));
                            },
                          }),
                        ]}
                    >
                    <Input 
                        name='quantity'
                        addonBefore={values.action === 'Buy' ? <PlusCircleOutlined /> : <MinusCircleOutlined />}
                        style={{width: '100%'}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="cash"
                        label="$ Available"
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
          $action: String
          $name: String
          $symbol: String
          $quantity: String
          $price: String
          ) {
          updatePortfolio(
            userId: $userId
            stockInput: {
              action: $action
              name: $name
              symbol: $symbol
              quantity: $quantity
              price: $price
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
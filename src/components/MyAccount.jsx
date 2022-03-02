import React, { useContext } from 'react';
import { AuthContext } from '../context/auth';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Col, Space, Table, Tag, Typography } from 'antd';
import BuySellDrawer from './BuySellDrawer';

import Loader from '../components/Loader';
import { useGetCoinsQuery } from '../services/cryptoApi';

const { Title } = Typography;

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const userId = user.id;
    
    const { data: cryptosList, isFetching } = useGetCoinsQuery(100);
    const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, { variables: { userId }});

    if(isFetching || !getUser){
       return <Loader />;
    } else {
      const { username, cash } = getUser;

    const tableData = []

    for (const coin of getUser.portfolio) {
        const cryptoData = cryptosList?.data?.coins.filter((crypto) => crypto.name.toLowerCase() === coin.name.toLowerCase());
        const pAndL = `${parseFloat((coin.averagePrice - cryptoData[0].price) * coin.quantity).toFixed(2)} (${parseFloat((((coin.averagePrice - cryptoData[0].price) * coin.quantity)/coin.averagePrice)*100).toFixed(2)}%)`
        let temp = {
            key: coin.name,
            symbol: cryptoData[0].symbol,
            name: coin.name,
            quantity: coin.quantity,
            average: parseFloat(coin.averagePrice).toFixed(2),
            profitloss: pAndL,
            currentPrice: parseFloat(cryptoData[0].price).toFixed(2),
            "24hrChange": cryptoData[0].change,
            tags: [coin.name.length > 7 ? 'fresh' : 'cool'],
            cryptoData,
            coin
        }
        tableData.push(temp)
    }

      const columns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol'
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: text => <a href='/'>{text}</a>,
        },
        {
          title: 'Qty',
          dataIndex: 'quantity',
          key: 'qty',
        },
        {
          title: 'Average Purchase Price',
          dataIndex: 'average',
          key: 'average',
        },
        {
            title: 'Profit / Loss',
            dataIndex: 'profitloss',
            key: 'profitloss',
          },
        {
          title: 'Current Price',
          dataIndex: 'currentPrice',
          key: 'current',
        },
        {
          title: '24hr Change',
          dataIndex: '24hrChange',
          key: '24hrchange',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: tags => (
            <>
              {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
                <BuySellDrawer userDetails={getUser} crypto={record.cryptoData[0]} title='Buy' buttonType="primary" name={record.name} />
                <BuySellDrawer userDetails={getUser} crypto={record.cryptoData[0]} title='Sell' buttonType="" name={record.name} />
            </Space>
          ),
        },
      ];

    const accountPage = user ? (
        <Col className="coin-heading-container">
          <Title level={2} className="coin-name">
            Welcome back, {username}
          </Title>
          <p>Head to the Cryptocurrencies tab to find new Coins to Buy</p>
          <p>{`You currently have $${cash} in your account`}</p>
          <Table style={{width: "100%"}} columns={columns} dataSource={tableData} />
          
        </Col>
    ) :
    (
        <Title>You are not authorized to view this page</Title>
    )

  return accountPage
    }
};

const FETCH_USER_QUERY = gql `
  query getUser($userId: String) {
  getUser(input: $userId) {
    id
    email
    createdAt
    username
    cash
    portfolio{
      name
      symbol
      quantity
      averagePrice
    }
  }
}
`

export default MyAccount;

import React, { useContext } from 'react';
import { AuthContext } from '../context/auth';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Col, Space, Table, Tag, Typography } from 'antd';
import BuySellDrawer from './BuySellDrawer';

import Loader from '../components/Loader';
import { useGetCoinsQuery } from '../services/cryptoApi';

const { Title } = Typography;

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const userId = user.id;
    
    const { data: { getUser, loading } = {} } = useQuery(FETCH_USER_QUERY, { variables: { userId }});
    const { data: cryptosList, isFetching } = useGetCoinsQuery(100);

    const [updatePortfolio] = useMutation(UPDATE_PORTFOLIO_MUTATION, {
      variables: {
          userId: userId,
          cash: "999",
          name: "Ethereum",
          symbol: "ETH",
          quantity: "12",
          averagePrice: "28000"
      }
    });

    if(isFetching || loading || !getUser) return <Loader />;

    const data = []

    for (const coin of getUser.portfolio) {
        const cryptoData = cryptosList?.data?.coins.filter((crypto) => crypto.name.toLowerCase() === coin.name.toLowerCase());
        const pAndL = `${parseFloat((coin.averagePrice - cryptoData[0].price) * coin.quantity).toFixed(2)} (${parseFloat((((coin.averagePrice - cryptoData[0].price) * coin.quantity)/coin.averagePrice)*100).toFixed(2)}%)`
        let temp = {
            key: coin.name,
            symbol: cryptoData[0].symbol,
            name: coin.name,
            quantity: coin.quantity,
            average: coin.averagePrice,
            profitloss: pAndL,
            currentPrice: parseFloat(cryptoData[0].price).toFixed(2),
            "24hrChange": cryptoData[0].change,
            tags: [coin.name.length > 7 ? 'fresh' : 'cool'],
            cryptoData,
            coin
        }
        data.push(temp)
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
                <BuySellDrawer userDetails={getUser} portfolio={record.coin} crypto={record.cryptoData} title='Buy' buttonType="primary" name={record.name} />
                <BuySellDrawer userDetails={getUser} portfolio={record.coin} crypto={record.cryptoData} title='Sell' buttonType="" name={record.name} />
            </Space>
          ),
        },
      ];

    const accountPage = user ? (
        <Col className="coin-heading-container">
          <Title level={2} className="coin-name">
            Welcome back, {user.username}
          </Title>
          <p>Head to the Cryptocurrencies tab to find new Coins to Buy</p>
          <p>{`You currently have $${getUser.cash} in your account`}</p>
          <Table style={{width: "100%"}} columns={columns} dataSource={data} />
        </Col>
    ) :
    (
        <Title>You are not authorized to view this page</Title>
    )

  return accountPage
};

const FETCH_USER_QUERY = gql `
  query($userId: String) {
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


export default MyAccount;

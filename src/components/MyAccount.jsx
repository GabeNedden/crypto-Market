import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Col, Space, Table, Tag, Typography } from 'antd';
import BuySellModal from './BuySellModal';

import Loader from '../components/Loader';
import { useGetCoinsQuery } from '../services/cryptoApi';

const { Title, Text } = Typography;

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const { userId } = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        if(user){
            if(user.id !== userId){
                navigate(`/useraccount/${user.id}`)
            }
        } else {
            navigate(`/login`)
        }
    })

    const { data: { getUser, loading } = {} } = useQuery(FETCH_USER_QUERY, { variables: { userId }});
    const { data: cryptosList, isFetching } = useGetCoinsQuery(100);

    const [coins, setCoins] = useState([]);
    const [cryptos, setCryptos] = useState([]);

    if(isFetching || loading) return <Loader />;

    console.log(getUser)

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
            tags: ['cool']
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
                  <Tag color={'purple'} key={tag}>
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
                <BuySellModal title='Buy' buttonType="primary" name='Bitcoin'/>
                <BuySellModal title='Sell' buttonType="" name='Bitcoin'/>
            </Space>
          ),
        },
      ];

    const accountPage = user.id === userId ? (
        <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
           Welcome back, {user.username}
        </Title>
        <p>Head to the Cryptocurrencies tab to find new Coins to Buy</p>
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

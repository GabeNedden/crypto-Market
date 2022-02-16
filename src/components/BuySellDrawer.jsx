import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { Avatar, Button, Col, Drawer, Divider, Row, Typography } from 'antd';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import Loader from './Loader';

const BuySellDrawer = (props) => {
    const coinId = props.crypto[0].uuid;

    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const cryptoDetails = data?.data?.coin;

    console.log(cryptoDetails)

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
          <p className="site-description-item-profile-p-label">{title}:</p>
          {content}
        </div>
      );

    const [ visible, setVisible ] = useState(false);

  const onClose = () => setVisible(false);

  if (isFetching) return <Loader />;

  return (
    <>
        <Button type={props.buttonType} onClick={() => setVisible(true)}>
          {props.title}
        </Button>

        <Drawer
          width={640}
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
            <Col span={12}>
              <DescriptionItem title="Current Price" content={parseFloat(cryptoDetails.price).toFixed(2)} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Change" content={`${cryptoDetails.change}%`} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="All Time High" content={parseFloat(cryptoDetails.allTimeHigh.price).toFixed(2)} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Symbol" content={cryptoDetails.symbol} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="IPO Date" content='Info available soon' />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Website" content={<a href={cryptoDetails.websiteUrl}>{cryptoDetails.websiteUrl}</a>} />
            </Col>
          </Row>
          <Row>
          <Divider />
          <Divider />
            <Col span={24}>
                {HTMLReactParser(cryptoDetails.description)}
            </Col>
            <Col span={24} className="coin-links">
          <Typography.Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Typography.Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={link.url}>
              <Typography.Title level={5} className="link-name">{link.type}</Typography.Title>
              <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
            </Row>
          ))}
        </Col>
          </Row>
        </Drawer>
      </>
  )
}

export default BuySellDrawer
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Typography, Space } from 'antd';

import './App.css'

import { Cryptocurrencies, CryptoDetails, Homepage, Login, MyAccount, Navbar, News, Register, UserAccount } from './components';
import { AuthProvider } from './context/auth';


const App = () => {
    return (
    <AuthProvider>
        <div className='app'>
            <div className='navbar'>
                <Navbar />
            </div>
            <div className='main'>
                <Layout>
                    <div className='routes'>
                        <Routes>
                            <Route exact path='/' element={<Homepage />} />
                            <Route exact path='/cryptocurrencies' element={<Cryptocurrencies />} />
                            <Route exact path='/crypto/:coinId' element={<CryptoDetails />} />
                            <Route exact path='/news' element={<News />} />
                            <Route exact path='/register' element={<Register />} />
                            <Route exact path='/login' element={<Login />} />
                            <Route exact path='/myaccount/:userId' element={<MyAccount />} />
                            <Route exact path='/useraccount/:userId' element={<UserAccount />} />
                        </Routes>
                    </div>
                </Layout>
            
                <div className='footer'>
                    <Typography.Title level={5} style={{color: 'white', textAlign: 'center'}}>
                        Crypto Market <br />
                        All Rights Reserved 2022
                    </Typography.Title>
                    <Space>
                        <Link to='/'>Home</Link>
                        <Link to='/'>News</Link>
                    </Space>
                </div>
            </div>
        </div>
    </AuthProvider>
    )
}

export default App

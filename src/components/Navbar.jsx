import React, {useState, useEffect, useContext } from 'react'
import { Avatar, Button, Menu, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import icon from '../images/cryptocurrency.png';

import { AuthContext } from '../context/auth';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(undefined);

    useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener('resize', handleResize);
      handleResize();
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (screenSize <= 800) {
        setActiveMenu(false);
      } else {
        setActiveMenu(true);
      }
    }, [screenSize]); 

    const navigate = useNavigate();
    const logoutHome = () => {
      logout();
      navigate('/');
    }

    const nav = user ? (
      <div className="nav-container">
          <div className="logo-container">
            <Avatar src={icon} size="large" />
            <Typography.Title level={2} className="logo"><Link to="/">Crypto Market</Link></Typography.Title>
            <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
          </div>
          {activeMenu && (
          <Menu theme="dark" >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FundOutlined />}>
              <Link to="/cryptocurrencies">Cryptocurrencies</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BulbOutlined />}>
              <Link to="/news">News</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to={`/myaccount/${user.id}`} >{user.username}</Link>
            </Menu.Item>
            <Menu.Item key="5" onClick={logoutHome} icon={<MoneyCollectOutlined />}>
              Logout
            </Menu.Item>
          </Menu>
          )}
        </div>
    ) : (
      <div className="nav-container">
          <div className="logo-container">
            <Avatar src={icon} size="large" />
            <Typography.Title level={2} className="logo"><Link to="/">Crypto Market</Link></Typography.Title>
            <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
          </div>
          {activeMenu && (
          <Menu theme="dark" >
            <Menu.Item icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item icon={<FundOutlined />}>
              <Link to="/cryptocurrencies">Cryptocurrencies</Link>
            </Menu.Item>
            <Menu.Item icon={<BulbOutlined />}>
              <Link to="/news">News</Link>
            </Menu.Item>
            <Menu.Item icon={<UserAddOutlined />}>
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item icon={<MoneyCollectOutlined />}>
              <Link to="/login">Log In</Link>
            </Menu.Item>
          </Menu>
          )}
        </div>
    )

    return nav 

    };

export default Navbar

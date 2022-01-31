import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import ServerProvider from "./ApolloProvider";

import store from './app/store';
import 'antd/dist/antd.min.css';

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <ServerProvider />
        </Provider>
    </Router>,
    
    document.getElementById('root'));
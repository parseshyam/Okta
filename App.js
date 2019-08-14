import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';
import { ToastContainer } from 'react-toastify'
import Home from './Home';
import MessageList from './MessageList'
import "react-toastify/dist/ReactToastify.css"

const config = {
  issuer: 'https://dev-808177.okta.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oa143zdd2oP2WEoR357'
}

class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer={config.issuer}
          client_id={config.client_id}
          redirect_uri={config.redirect_uri}
        >
          <Switch>
            <Route path='/MessageList' component={MessageList} />
            <Route path='/' exact={true} component={Home} />
            <Route path='/implicit/callback' component={ImplicitCallback} />
            <ToastContainer />
          </Switch>
          <ToastContainer autoClose={3000} />
        </Security>
      </Router>
    );
  }
}

export default App;
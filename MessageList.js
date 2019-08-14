import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { toast } from 'react-toastify';

export default withAuth(class MessageList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: null
        }
    }

    async componentDidMount() {
        console.log(this.props.auth.getAccessToken())
        try {
            const response = await fetch('http://localhost:7000/api/messages', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
                }
            });
            const data = await response.json();
            let message = data.message
            this.setState({ messages: message });
        } catch (err) {
            toast.error('UNEXPECTED ERROR : ' + err)
            console.log('error : ', err)
        }
    }

    render() {
        console.log(this.state)
        if (!this.state.messages)
            return <div>Loading..</div>;
        else
            return <div>{this.state.messages}</div>;
    }
});
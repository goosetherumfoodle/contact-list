import React, { Component } from 'react'
import {connect} from 'react-redux'

import * as actions from './store/actions'
import DemoTable from './components/DemoTable'
import logo from './logo.svg'
import './App.css'
import NewContactForm from './components/NewContactForm'

class App extends Component {
  componentDidMount() {
    this.props.fetchInitialContacts()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="container">
          <div className="row">
            <div className="card col-6 offset-3">
              <div className="card-header">
        Add New Contact
              </div>
              <div className="card-body">
                <NewContactForm />
              </div>
            </div>
          </div>
          <div className="row">
            <DemoTable data={this.props.contacts.toJS()}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({contact}) => {
  return {
    contacts: contact.get('contacts')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchInitialContacts: () => dispatch(actions.fetchInitialContacts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

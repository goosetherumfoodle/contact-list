import React, { Component } from 'react'
import {connect} from 'react-redux'

import * as actions from './store/actions'
import buildDemoTable from './components/buildDemoTable'
import logo from './logo.svg'
import './App.css'
import NewContactForm from './components/NewContactForm'

function serverError(warning) {
  if (warning) {
    return <div className='col alert alert-danger'>{warning}</div>
  } else {
    return null
  }
}

class App extends Component {
  componentDidMount() {
    this.props.fetchInitialContacts()
  }

  render() {
    const DemoTable = buildDemoTable(this.props.contactDelete)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {serverError(this.props.serverError)}
        <div className="container-flex mt-3 mb-3">
          <NewContactForm
            missingFields={this.props.contactFormMissingFields}
            warningMessage={this.props.contactFormWarning}
            handleFormSubmit={this.props.handleContactFormSubmit}
            fields={this.props.newContactFormFields}
            setNewContactName={this.props.setNewContactName}
            setNewContactContext={this.props.setNewContactContext}
            setNewContactNumber={this.props.setNewContactNumber}
            setCountryCode={this.props.setCountryCode}
            serverError={this.props.serverError} />
        </div>
        <div className="container-flex">
          <DemoTable data={this.props.contacts.toJS()} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({contact}) => {
  return {
    contacts: contact.get('contacts'),
    newContactFormFields: contact.get('newContactForm'),
    contactFormMissingFields: contact.get('contactFormMissingFields'),
    contactFormWarning: contact.getIn(['newContactForm', 'generalWarning']),
    serverError: contact.get('serverError'),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchInitialContacts: () => dispatch(actions.fetchInitialContacts()),
    setNewContactName: (name) => dispatch(actions.setNewContactName(name)),
    setNewContactNumber: (number) => dispatch(actions.setNewContactNumber(number)),
    setNewContactContext: (context) => dispatch(actions.setNewContactContext(context)),
    setCountryCode: (code) => dispatch(actions.setNewContactCountryCode(code)),
    handleContactFormSubmit: (fields) => {dispatch(actions.submitNewContact(fields))},
    contactDelete: id => dispatch(actions.deleteContact(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

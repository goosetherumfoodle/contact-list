import React from 'react'
import metadata from '../metadata.min.json'

function formErrors(warning) {
  if (warning) {
    return <div className='col alert alert-danger'>{warning}</div>
  } else {
    return null
  }
}

function cssFeedback(invalidNumber) {return invalidNumber ? 'is-invalid' : ''}

function eachCountryCode() {
  return Object.keys(metadata.countries).map(countryCode => <option key={countryCode} value={countryCode}>{countryCode}</option>)
}

export default function NewContactForm(props) {
  return(
    <div className="card col-10 offset-1">
      <div className="card-header">
                New Contact
      </div>
      <div className="card-body">

        <form onSubmit={e => {e.preventDefault(); props.handleFormSubmit({name: props.fields.get('name'), number: props.fields.get('phoneNumber'), context: props.fields.get('context')})}} >
          <div className='row'>{formErrors(props.warningMessage)}</div>
          <div className='form-row'>
            <div className='col'>
              <label>Name</label>
              <input disabled={!!props.serverError} type="name" className="form-control" id="exampleInputName1" placeholder="Jen Hamilton" value={props.fields.get('name')} onChange={e => props.setNewContactName(e.target.value)} />
            </div>

            <div className='col'>
              <label>Context</label>
              <input disabled={!!props.serverError} type="context" className="form-control" id="exampleInputContext1" placeholder="work, school, friends, etc" onChange={e => props.setNewContactContext(e.target.value)} value={props.fields.get('context')} />
            </div>

            <div className='col'>
              <label>Number</label>
              <input disabled={!!props.serverError} type="phone" className={`form-control ${cssFeedback(props.fields.get('invalidNumber'))}`} id="exampleInputPhone1" aria-describedby="phoneHelp" placeholder='555-555-5555' onChange={e => props.setNewContactNumber(e.target.value)} value={props.fields.get('phoneNumber')} />
              <div className='invalid-feedback'>Invalid Number</div>
              <small className='form-text text-muted'>{props.fields.get('prettyPrintPhoneNumber')}</small>
            </div>

            <div className='col'>
              <label>
         Country
              </label>
              <select className='custom-select' value={props.fields.get('countryCode')} onChange={e => props.setCountryCode(e.target.value)}>
                {eachCountryCode()}
              </select>
            </div>

            <div className='col mt-4'>
              <input disabled={!!props.serverError} type="submit" value='Submit' className="btn btn-primary" />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

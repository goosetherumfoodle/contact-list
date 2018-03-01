import React from 'react'
import metadata from '../metadata.min.json'

function formErrors(warning) {
  if (!!warning) {
    return <div className='alert alert-danger'>{warning}</div>
  } else {
    return null
  }
}

function cssFeedback(invalidNumber) {
  if (!!invalidNumber) {return 'is-invalid'}
  return ''
}

function eachCountryCode() {
  return Object.keys(metadata.countries).map(countryCode => <option key={countryCode} value={countryCode}>{countryCode}</option>)
}

export default function NewContactForm(props) {
  return(<form onSubmit={e => {e.preventDefault(); props.handleFormSubmit({name: props.fields.get('name'), number: props.fields.get('phoneNumber'), context: props.fields.get('context')})}} >
    <div className="form-group">
      {formErrors(props.warningMessage)}
      <label for="exampleInputName1">Name</label>
      <input type="name" className="form-control" id="exampleInputName1" placeholder="Jen Hamilton" value={props.fields.get('name')} onChange={e => props.setNewContactName(e.target.value)} />
    </div>

         <div className='form-group'>
                 <label>
         Select Country Code
         <select value={props.fields.get('countryCode')} onChange={e => props.setCountryCode(e.target.value)}>
            {eachCountryCode()}
          </select>
         </label>
         </div>

    <div className="form-group">
      <label>Phone Number</label>
         <input type="phone" className={`form-control ${cssFeedback(props.fields.get('invalidNumber'))}`} id="exampleInputPhone1" aria-describedby="phoneHelp" placeholder={props.fields.get('numberTemplate')} onChange={e => props.setNewContactNumber(e.target.value)} value={props.fields.get('phoneNumber')} />
         <div className='invalid-feedback'>Please provide a valid phone number</div>
         <small className='form-text text-muted'>{props.fields.get('prettyPrintPhoneNumber')}</small>
    </div>

    <div className="form-group">
      <label>Context</label>
      <input type="context" className="form-control" id="exampleInputContext1" placeholder="work, school, friends, etc" onChange={e => props.setNewContactContext(e.target.value)} value={props.fields.get('context')} />
    </div>

    <div className="form-check">
      <input type="checkbox" className="form-check-input" id="exampleCheck1" />
      <label className="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <input type="submit" value='Submit' className="btn btn-primary" />
  </form>)
}

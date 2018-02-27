import React from 'react'

function formErrors(missingFields) {
  if (missingFields) {
    return <div className='alert alert-danger'>Please fill out all contact fields</div>
  } else {
    return null
  }
}

function cssFeedback(invalidNumber) {
  if (!!invalidNumber) {return 'is-invalid'}
  return ''
}

export default function NewContactForm(props) {
  return(<form onSubmit={e => {e.preventDefault(); props.handleFormSubmit({name: props.fields.get('name'), number: props.fields.get('phoneNumber'), context: props.fields.get('context')})}} >
    <div className="form-group">
      {formErrors(props.missingFields)}
      <label for="exampleInputName1">Name</label>
      <input type="name" className="form-control" id="exampleInputName1" placeholder="Name" value={props.fields.get('name')} onChange={e => props.setNewContactName(e.target.value)} />
    </div>

    <div className="form-group">
      <label>Phone Number</label>
         <input type="phone" className={`form-control ${cssFeedback(props.fields.get('invalidNumber'))}`} id="exampleInputPhone1" aria-describedby="phoneHelp" placeholder="Enter phone" onChange={e => props.setNewContactNumber(e.target.value)}/>
         <div className='invalid-feedback'>Please provide a valid phone number</div>
    </div>
ADD COUNTRYCODE SELECTOR
    <div className="form-group">
      <label>Context</label>
      <input type="context" className="form-control" id="exampleInputContext1" placeholder="work, school, friends, etc" onChange={e => props.setNewContactContext(e.target.value)} />
    </div>

    <div className="form-check">
      <input type="checkbox" className="form-check-input" id="exampleCheck1" />
      <label className="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <input type="submit" value='Submit' className="btn btn-primary" />
  </form>)
}

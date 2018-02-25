import React from 'react'

export default function NewContactForm() {
  return(<form>
           <div className="form-group">
    <label for="exampleInputName1">Name</label>
    <input type="name" className="form-control" id="exampleInputName1" placeholder="Name" />
  </div>

  <div className="form-group">
    <label for="exampleInputPhone1">Phone Number</label>
    <input type="phone" className="form-control" id="exampleInputPhone1" aria-describedby="phoneHelp" placeholder="Enter phone" />
  </div>

  <div className="form-group">
    <label for="exampleInputContext1">Context</label>
    <input type="context" className="form-control" id="exampleInputContext1" placeholder="work, school, friends, etc" />
  </div>

  <div className="form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>)
}

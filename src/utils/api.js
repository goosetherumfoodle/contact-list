import axios from 'axios'

const base = axios.create({
  baseURL: 'http://localhost:3000'
})

function getContacts() {return base.get('/contacts')}

function postContact({id, name, number, context}) {
  return base.post('/contacts', {id, number, name, number, context})
}

export {getContacts, postContact}

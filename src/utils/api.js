import axios from 'axios'

const base = axios.create({
  baseURL: 'http://localhost:3000'
})

export function getContacts() {return base.get('/contacts')}

export function postContact({id, name, number, context}) {
  return base.post('/contacts', {id, number, name, number, context})
}

export function deleteContact({id}) {
  return base.delete(`/contacts/${id}`)
}

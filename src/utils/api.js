import axios from 'axios'

const base = axios.create({
  baseURL: 'http://localhost:3000'
})

function getContacts() {return base.get('/contacts')}

export {getContacts}

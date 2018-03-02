import {parse, format} from 'libphonenumber-js'

function tryParse(number, countryCode) {
  const parseAttempt = parse(number, countryCode)
  if (parseAttempt.phone) {return parseAttempt}
  return false
}

function tryFormat({number, countryCode}) {
  const parsed = tryParse(number, countryCode)
  if (parsed) {return format(parsed, 'E.164')}
  return false
}

export {tryFormat}

import {expect} from 'chai'

import {tryFormat} from '../src/utils/phoneParser'

describe('utils/phoneParser', () => {
  describe('parsing and formatting an input number', () => {
    const number = '412.454.2543'
    const countryCode = 'US'
    context('with valid inputs', () => {
      it('returns E.164 formatted string', () => {
        const result = tryFormat({number, countryCode})
        expect(result).to.equal('+14124542543')
      })
    })

    context('with an invalid number', () => {
      const shortNumber = '412.454.253'
      it('returns false', () => {
        const result = tryFormat({number: shortNumber, countryCode})
        expect(result).to.equal(false)
      })
    })

    context('with an invalid country code', () => {
      const badCountryCode = 'JX'
      it('throw an error', () => {
        expect(() => tryFormat({number, countryCode: badCountryCode}))
          .to.throw('Unknown country: JX')
      })
    })
  })
})

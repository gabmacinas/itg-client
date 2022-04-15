import React from 'react'
import DOMPurify from 'dompurify'
import termsHTML from './html/terms.html'
const mySafeHTML = DOMPurify.sanitize(termsHTML)

function TermsAndConditions () {
  return (
  <div dangerouslySetInnerHTML={{ __html: mySafeHTML }}></div>
  )
}

export default TermsAndConditions

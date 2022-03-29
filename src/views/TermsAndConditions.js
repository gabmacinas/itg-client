import React from 'react'
import DOMPurify from 'dompurify'
import testHtml from './html/test.html'
const mySafeHtml = DOMPurify.sanitize(testHtml)

function TermsAndConditions () {
  return (
    // <div>TermsAndConditions</div>
    <div dangerouslySetInnerHTML={{ __html: mySafeHtml }}></div>
  )
}

export default TermsAndConditions

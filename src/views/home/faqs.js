import React from 'react'
import DOMPurify from 'dompurify'
import faqHTML from '.././html/FAQ.html'
const mySafeHTML = DOMPurify.sanitize(faqHTML)

function Faq () {
  return (
  <div dangerouslySetInnerHTML={{ __html: mySafeHTML }}></div>
  )
}

export default Faq

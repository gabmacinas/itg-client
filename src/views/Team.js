import React from 'react'
import DOMPurify from 'dompurify'
import teamHTML from './html/team.html'
const mySafeHTML = DOMPurify.sanitize(teamHTML)

function Team () {
  return (
  <div dangerouslySetInnerHTML={{ __html: mySafeHTML }}></div>
  )
}

export default Team

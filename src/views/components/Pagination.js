import React from 'react'
import PropTypes from 'prop-types'

const Pagination = ({ collectionsPerPage, totalCollections, currentPage, paginate }) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalCollections / collectionsPerPage); i++) {
    pageNumbers.push(i)
  }
  return (
    <div className='container-fluid'>
      <ul className='pagination pagination-sm"'>
        <li className='page-item'>
          <a className='page-item' onClick={() => {
            if (currentPage <= 1) return null
            paginate(currentPage - 1)
          }}>
            Prev
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className={ currentPage === number ? 'active' : ''}>
            <a className='page-item' onClick={() => paginate(number)}>
              {number}
            </a>
          </li>
        ))}
        <li className='page-item'>
          <a className='page-item' onClick={() => {
            if (currentPage >= pageNumbers.length) return null
            paginate(currentPage + 1)
          }}>
            Next
          </a>
        </li>
      </ul>
    </div>
  )
}

Pagination.propTypes = {
  collectionsPerPage: PropTypes.number.isRequired,
  totalCollections: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired
}

export default Pagination

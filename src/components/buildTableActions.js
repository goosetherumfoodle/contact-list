import React from 'react'
import PropTypes from 'react-proptypes'

const propTypes = {
  row: PropTypes.shape({
    number: PropTypes.string.isRequired
  }).isRequired
}

function buildTableActions(actions) {
  const TableActions = (props) => {
    const handleDelete = () => actions.deleteHandler(props.row.number)
    return (
      <span onClick={handleDelete}>
        <i className='fa fa-trash' />
      </span>
    )
  }
  TableActions.propTypes = propTypes
  return TableActions
}

export default buildTableActions

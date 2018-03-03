import React, {Component} from 'react'
import {Link} from 'react-router-dom'

// const propTypes = {
//   row: PropTypes.object.isRequired,
// };


function buildTableActions(actions) {
  return props => {
    const handleDelete = () => actions.deleteHandler(props.row.number)
    return (
      <span onClick={handleDelete}>
        <i className='fa fa-trash' />
        </span>
    )
  }
}
//AppsTableActions.propTypes = propTypes;
export default buildTableActions

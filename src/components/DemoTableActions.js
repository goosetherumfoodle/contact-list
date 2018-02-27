import React, {Component} from 'react'
import {Link} from 'react-router-dom'

// const propTypes = {
//   row: PropTypes.object.isRequired,
// };

class AppsTableActions extends Component {
  render() {
    console.log(`row: ${JSON.stringify(row)}`)
    const row = this.props.row
    return (
      <Link to={'/settings/3'}>
        Settings
      </Link>
    )
  }
}
//AppsTableActions.propTypes = propTypes;
export default AppsTableActions

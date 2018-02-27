import React, { Component } from 'react'
import sematable, { Table } from 'sematable'
import PropTypes from 'prop-types'

import DemoTableActions from './DemoTableActions'

const columns = [
  {key: 'name', header: 'Name', sortable: true, searchable: true},
  {key: 'number', header: '#', searchable: true, primaryKey: true},
  {key: 'context', header: 'Context', sortable: true, searchable: true},
  {key: 'actions', header: 'Actions', Component: DemoTableActions}
]

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
}


class DemoTable extends Component {
  render() {
    return (
      <Table
        {...this.props}
        selectable
        columns={columns}
      />
    )
  }
}

DemoTable.propTypes = propTypes
export default sematable('allApps', DemoTable, columns)

import React, { Component } from 'react'
import sematable, { Table } from 'sematable'
import PropTypes from 'prop-types'

import buildTableActions from './buildTableActions'

function buildColumns(deleteHandler) {
  return ([
    {key: 'name', header: 'Name', sortable: true, searchable: true},
    {key: 'number', header: 'Phone', searchable: true, primaryKey: true},
    {key: 'context', header: 'Context', sortable: true, searchable: true},
    {key: 'actions', header: 'Actions', Component: buildTableActions({deleteHandler})}
  ])
}

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
}


function buildDemoTable(columns) {
  return (props) => {
    return(
      <div className='col'>
        <Table
          {...props}
          columns={columns} />
      </div>
    )
  }
}

// DemoTable.propTypes = propTypes
export default (deleteHandler) => {
  return (sematable(
    'allApps',
    buildDemoTable(buildColumns(deleteHandler)),
    buildColumns(deleteHandler)
  ))
}

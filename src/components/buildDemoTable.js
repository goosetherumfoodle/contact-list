import React from 'react'
import sematable, { Table } from 'sematable'

import buildTableActions from './buildTableActions'

function buildColumns(deleteHandler) {
  return ([
    {key: 'name', header: 'Name', sortable: true, searchable: true},
    {key: 'number', header: 'Phone', searchable: true, primaryKey: true},
    {key: 'context', header: 'Context', sortable: true, searchable: true},
    {key: 'actions', header: 'Actions', Component: buildTableActions({deleteHandler})}
  ])
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

export default (deleteHandler) => {
  return (sematable(
    'allApps',
    buildDemoTable(buildColumns(deleteHandler)),
    buildColumns(deleteHandler)
  ))
}

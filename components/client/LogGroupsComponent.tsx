'use client'
import { LogGroupRecord, LogGroupRecords } from '@/app/LogGroup/page'
import Link from '@/components/ui/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid'
import { format } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  {
    field: 'creationTime',
    headerName: 'creationTime',
    width: 200,
    filterable: true,
  },
  {
    field: 'logGroupName',
    headerName: 'logGroupName',
    flex: 0.1,
    filterable: true,
    renderCell: (params: GridRenderCellParams) => (
      <>
        <Link href={`/LogGroup/${encodeURIComponent(params.row.logGroupName)}`}>{params.id}</Link>
      </>
    ),
  },
]

export function LogGroupsComponent({
  fetchHandler,
}: {
  fetchHandler: () => Promise<LogGroupRecords>
}) {
  const [rows, setRows] = useState<object[]>([])

  useEffect(() => {
    async function loadLogStreams() {
      const res = await fetchHandler()
      setRows(
        res.logGroups.map((logGroup: LogGroupRecord) => {
          return {
            creationTime: format(logGroup.creationTime, 'yyyy-MM-dd HH:mm:ss.SSS', {
              locale: ja,
            }),
            logGroupName: logGroup.logGroupName,
          }
        }),
      )
    }
    loadLogStreams()
  }, [])

  return (
    <div>
      <Breadcrumbs className="text-sm mb-4" aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <label className="text-slate-900 font-bold">LogGroup</label>
      </Breadcrumbs>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
        getRowId={(row) => row.logGroupName}
        style={{ width: '100%' }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  )
}

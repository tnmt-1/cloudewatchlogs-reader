'use client'
import { LogStreamsRecord, LogStreamsRecords } from '@/app/LogGroup/[logGroupName]/page'
import Link from '@/components/ui/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid'
import { format } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  {
    field: 'firstEventTimestamp',
    headerName: 'firstEventTimestamp',
    width: 200,
    filterable: true,
  },
  {
    field: 'lastEventTimestamp',
    headerName: 'lastEventTimestamp',
    width: 200,
    filterable: true,
  },
  {
    field: 'logStreamName',
    headerName: 'logStreamName',
    flex: 0.1,
    filterable: true,
    renderCell: (params: GridRenderCellParams) => (
      <>
        <Link href={`/LogGroup/${params.row.logGroupName}/${encodeURIComponent(params.id)}`}>
          {params.id}
        </Link>
      </>
    ),
  },
]

export function LogStreamsComponent({
  logGroupName,
  fetchHandler,
}: {
  logGroupName: string
  fetchHandler: (logGroupName: string) => Promise<LogStreamsRecords>
}) {
  const [rows, setRows] = useState<object[]>([])

  useEffect(() => {
    async function loadLogStreams() {
      const res = await fetchHandler(logGroupName)
      setRows(
        res.logStreams.map((logStream: LogStreamsRecord) => {
          return {
            firstEventTimestamp: format(logStream.firstEventTimestamp, 'yyyy-MM-dd HH:mm:ss.SSS', {
              locale: ja,
            }),
            lastEventTimestamp: format(logStream.lastEventTimestamp, 'yyyy-MM-dd HH:mm:ss.SSS', {
              locale: ja,
            }),
            logStreamName: logStream.logStreamName,
            logGroupName: logGroupName,
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
        <Link href="/LogGroup">LogGroup</Link>
        <label className="text-slate-900 font-bold">{decodeURIComponent(logGroupName)}</label>
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
        getRowId={(row) => row.logStreamName}
        style={{ width: '100%' }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  )
}

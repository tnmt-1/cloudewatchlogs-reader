'use client'
import { LogStreamsRecord } from '@/app/LogGroup/[logGroupName]/page'
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

type GridRowDef = {
  firstEventTimestamp: string
  lastEventTimestamp: string
  logStreamName: string
  logGroupName: string
}

export function LogStreamsComponent({
  logGroupName,
  fetchHandler,
}: {
  logGroupName: string
  fetchHandler: (logGroupName: string) => Promise<LogStreamsRecord[]>
}) {
  const [rows, setRows] = useState<GridRowDef[]>([])

  useEffect(() => {
    async function loadLogStreams() {
      const res: LogStreamsRecord[] = await fetchHandler(logGroupName)
      const rows: GridRowDef[] = res.map((logStream: LogStreamsRecord) => {
        const row: GridRowDef = {
          firstEventTimestamp: format(logStream.firstEventTimestamp, 'yyyy-MM-dd HH:mm:ss.SSS', {
            locale: ja,
          }),
          lastEventTimestamp: format(logStream.lastEventTimestamp, 'yyyy-MM-dd HH:mm:ss.SSS', {
            locale: ja,
          }),
          logStreamName: logStream.logStreamName,
          logGroupName: logGroupName,
        }
        return row
      })
      setRows(rows)
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

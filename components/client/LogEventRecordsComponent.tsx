'use client'
import { LogEventResponse } from '@/app/LogGroup/[logGroupName]/[logStreamName]/page'
import Link from '@/components/ui/Link'
import { OutputLogEvent } from '@/pages/api/cloudwatchlogs/GetLogEvents'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid'
import { format } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: 'timestamp', width: 200, filterable: true },
  { field: 'requestId', headerName: 'requestId', width: 300, filterable: true },
  {
    field: 'message',
    headerName: 'message',
    minWidth: 200,
    flex: 0.4,
    filterable: true,
    renderCell: (params: GridRenderCellParams) => {
      return <div style={{ whiteSpace: 'normal' }}>{params.row.message}</div>
    },
  },
]

type GridRowDef = {
  id: string
  timestamp: string
  message: string
  requestId: string
}

export function LogEventRecordsComponent({
  logGroupName,
  logStreamName,
  fetchHandler,
}: {
  logGroupName: string
  logStreamName: string
  fetchHandler: (logGroupName: string, logStreamName: string) => Promise<LogEventResponse>
}) {
  const [rows, setRows] = useState<GridRowDef[]>([])

  useEffect(() => {
    async function loadLogEventRecords() {
      const res: LogEventResponse = await fetchHandler(logGroupName, logStreamName)
      const requestId: string = res.requestId ?? ''
      const events: OutputLogEvent[] = res.events

      const rows: GridRowDef[] = events.map((event: OutputLogEvent) => {
        const row: GridRowDef = {
          id: event.eventId ?? '',
          timestamp: event.timestamp
            ? format(event.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS', { locale: ja })
            : '',
          message: event.message ?? '',
          requestId: requestId,
        }
        return row
      })

      setRows(rows)
    }
    loadLogEventRecords()
  }, [])

  return (
    <div>
      <Breadcrumbs className="text-sm mb-4" aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <Link href="/LogGroup">LogGroup</Link>
        <Link href={`/LogGroup/${logGroupName}`}>{decodeURIComponent(logGroupName)}</Link>
        <label className="text-slate-900 font-bold">{decodeURIComponent(logStreamName)}</label>
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
        getRowId={(row) => row.id}
        style={{ width: '100%' }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  )
}

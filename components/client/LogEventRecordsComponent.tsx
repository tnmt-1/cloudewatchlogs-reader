'use client'
import { LogEventRecord, LogEventRecords } from '@/app/LogEvent/[logGroupName]/[logStreamName]/page'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid'
import { format } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: 'timestamp', width: 200, filterable: true },
  {
    field: 'message',
    headerName: 'message',
    minWidth: 200,
    flex: 0.4,
    filterable: true,
    renderCell: (params: GridRenderCellParams) => {
      console.log(params)
      return <div style={{ whiteSpace: 'normal' }}>{params.row.message}</div>
    },
  },
]

export function LogEventRecordsComponent({
  logGroupName,
  logStreamName,
  fetchHandler,
}: {
  logGroupName: string
  logStreamName: string
  fetchHandler: (logGroupName: string, logStreamName: string) => Promise<LogEventRecords>
}) {
  const [rows, setRows] = useState<object[]>([])

  useEffect(() => {
    async function loadLogEventRecord() {
      const logEvents = await fetchHandler(logGroupName, logStreamName)
      setRows(
        logEvents.events.map((logEventRecord: LogEventRecord) => {
          return {
            id: logEventRecord.eventId,
            timestamp: format(logEventRecord.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS', { locale: ja }),
            message: logEventRecord.message,
          }
        }),
      )
    }
    loadLogEventRecord()
  }, [])

  return (
    <div>
      <div>{decodeURIComponent(logGroupName)}</div>
      <div>{decodeURIComponent(logStreamName)}</div>
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

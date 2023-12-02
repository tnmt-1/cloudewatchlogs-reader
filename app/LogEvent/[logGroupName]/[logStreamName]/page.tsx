import { LogEventRecordsComponent } from '@/components/client/LogEventRecordsComponent'

export type LogEventRecords = {
  events: LogEventRecord[]
}

export type LogEventRecord = {
  eventId: string
  ingestionTime: number
  message: string
  timestamp: number
}

async function fetchLogEventRecords(
  logGroupName: string,
  logStreamName: string,
): Promise<LogEventRecords> {
  'use server'
  const res = await fetch(
    `http://localhost:3000/api/cloudwatchlogs/GetLogEvents?logGroupName=${logGroupName}&logStreamName=${logStreamName}`,
  )
  const resBody = await res.json()
  return resBody.message
}

export default async function Page({
  params,
}: { params: { logGroupName: string; logStreamName: string } }) {
  return (
    <LogEventRecordsComponent
      logGroupName={params.logGroupName}
      logStreamName={params.logStreamName}
      fetchHandler={fetchLogEventRecords}
    />
  )
}

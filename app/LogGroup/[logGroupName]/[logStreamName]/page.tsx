import { LogEventRecordsComponent } from '@/components/client/LogEventRecordsComponent'
import { OutputLogEvent } from '@/pages/api/cloudwatchlogs/GetLogEvents'

export type LogEventResponse = {
  requestId?: string
  events: OutputLogEvent[]
}

async function fetchLogEventRecords(
  logGroupName: string,
  logStreamName: string,
): Promise<LogEventResponse> {
  'use server'
  const url = new URL(
    `/api/cloudwatchlogs/GetLogEvents?logGroupName=${logGroupName}&logStreamName=${logStreamName}`,
    process.env.BASE_URL,
  )
  const res: Response = await fetch(url.toString())
  const resBody = await res.json()
  return resBody
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

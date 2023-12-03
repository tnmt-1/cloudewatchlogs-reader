import { LogStreamsComponent } from '@/components/client/LogStreamsComponent'

export type LogStreamsRecords = {
  logStreams: LogStreamsRecord[]
}

export type LogStreamsRecord = {
  firstEventTimestamp: number
  lastEventTimestamp: number
  logStreamName: string
}

async function fetchLogEventRecords(logGroupName: string): Promise<LogStreamsRecords> {
  'use server'
  const res = await fetch(
    `${process.env.BASE_URL}/api/cloudwatchlogs/DescribeLogStreams?logGroupName=${logGroupName}`,
  )
  const resBody = await res.json()
  return resBody.message
}

export default async function Page({ params }: { params: { logGroupName: string } }) {
  return (
    <LogStreamsComponent logGroupName={params.logGroupName} fetchHandler={fetchLogEventRecords} />
  )
}

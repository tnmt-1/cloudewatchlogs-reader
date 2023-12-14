import { LogStreamsComponent } from '@/components/client/LogStreamsComponent'

export type LogStreamsRecord = {
  firstEventTimestamp: number
  lastEventTimestamp: number
  logStreamName: string
}

async function fetchLogEventRecords(logGroupName: string): Promise<LogStreamsRecord[]> {
  'use server'
  const url = new URL(
    `/api/cloudwatchlogs/DescribeLogStreams?logGroupName=${logGroupName}`,
    process.env.BASE_URL,
  )
  const res = await fetch(url.toString())
  const resBody = await res.json()
  return resBody
}

export default async function Page({ params }: { params: { logGroupName: string } }) {
  return (
    <LogStreamsComponent logGroupName={params.logGroupName} fetchHandler={fetchLogEventRecords} />
  )
}

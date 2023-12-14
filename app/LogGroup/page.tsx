import { LogGroupsComponent } from '@/components/client/LogGroupsComponent'

export type LogGroupRecord = {
  creationTime: number
  logGroupName: string
}

async function fetchLogGroupRecords(): Promise<LogGroupRecord[]> {
  'use server'
  const url = new URL('/api/cloudwatchlogs/DescribeLogGroups', process.env.BASE_URL)
  const res = await fetch(url.toString())
  const resBody = await res.json()
  return resBody
}

export default async function Index() {
  return <LogGroupsComponent fetchHandler={fetchLogGroupRecords} />
}

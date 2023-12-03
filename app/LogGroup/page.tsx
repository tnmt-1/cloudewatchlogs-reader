import { LogGroupsComponent } from '@/components/client/LogGroupsComponent'

export type LogGroupRecords = {
  logGroups: LogGroupRecord[]
}

export type LogGroupRecord = {
  creationTime: number
  logGroupName: string
}

async function fetchLogGroupRecords(): Promise<LogGroupRecords> {
  'use server'
  const res = await fetch(`${process.env.BASE_URL}/api/cloudwatchlogs/DescribeLogGroups`)
  const resBody = await res.json()
  return resBody
}

export default async function Index() {
  return <LogGroupsComponent fetchHandler={fetchLogGroupRecords} />
}

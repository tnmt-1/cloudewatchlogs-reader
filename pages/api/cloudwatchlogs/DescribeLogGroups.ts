import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
  DescribeLogGroupsCommandOutput,
  LogGroup,
} from "@aws-sdk/client-cloudwatch-logs";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponseData = LogGroup[];

type ErrorResponseData = {
  error: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponseData | ErrorResponseData>
) {
  try {
    const client = new CloudWatchLogsClient({ region: "ap-northeast-1" });
    const params: DescribeLogGroupsCommandInput = {};
    const command = new DescribeLogGroupsCommand(params);
    const data: DescribeLogGroupsCommandOutput = await client.send(command);
    res.status(200).json(data.logGroups ?? []);
  } catch (error: unknown) {
    // error handling.
    console.log(error);
    res.status(500).json({ error: error });
  }
}

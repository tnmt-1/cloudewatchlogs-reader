import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponseData = {
  logGroups: object;
};
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
    const data = await client.send(command);
    res.status(200).json({ logGroups: data.logGroups ?? [] });
  } catch (error: unknown) {
    // error handling.
    console.log(error);
    res.status(500).json({ error: error });
  }
}

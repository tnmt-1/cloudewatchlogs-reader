import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  DescribeLogStreamsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs"; // ES Modules import
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponseData = {
  logStreams: object;
};
type ErrorResponseData = {
  error: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponseData | ErrorResponseData>
) {
  try {
    const { logGroupName }: { logGroupName?: string } = req.query;
    if (!logGroupName) {
      return res.status(400).json({ error: "ロググループを指定してください" });
    }

    const client = new CloudWatchLogsClient({ region: "ap-northeast-1" });
    const params: DescribeLogStreamsCommandInput = {
      logGroupName: logGroupName,
    };
    const command = new DescribeLogStreamsCommand(params);
    const data = await client.send(command);
    res.status(200).json({ logStreams: data.logStreams ?? [] });
  } catch (error: unknown) {
    // error handling.
    console.log(error);
    res.status(500).json({ error: error });
  }
}

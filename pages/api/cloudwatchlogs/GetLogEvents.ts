import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
  GetLogEventsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponseData = {
  events: object;
};
type ErrorResponseData = {
  error: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponseData | ErrorResponseData>
) {
  try {
    const {
      logGroupName,
      logStreamName,
    }: { logGroupName?: string; logStreamName?: string } = req.query;
    if (!logGroupName) {
      return res.status(400).json({ error: "ロググループを指定してください" });
    }
    if (!logStreamName) {
      return res
        .status(400)
        .json({ error: "ログストリームを指定してください" });
    }

    const client = new CloudWatchLogsClient({ region: "ap-northeast-1" });
    const params: GetLogEventsCommandInput = {
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      startFromHead: true,
    };
    const command = new GetLogEventsCommand(params);
    const data = await client.send(command);
    res.status(200).json({ events: data.events ?? [] });
  } catch (error: unknown) {
    // error handling.
    console.log(error);
    res.status(500).json({ error: error });
  }
}

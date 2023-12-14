import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
  GetLogEventsCommandInput,
  GetLogEventsCommandOutput,
  OutputLogEvent as DefaultOutputLogEvent,
} from "@aws-sdk/client-cloudwatch-logs";
import type { NextApiRequest, NextApiResponse } from "next";

export type OutputLogEvent = {
  eventId?: string;
} & DefaultOutputLogEvent;

type SuccessResponseData = {
  requestId?: string;
  events: OutputLogEvent[];
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
    const data: GetLogEventsCommandOutput = await client.send(command);
    res.status(200).json({
      requestId: data.$metadata.requestId,
      events: data.events ?? [],
    });
  } catch (error: unknown) {
    // error handling.
    console.log(error);
    res.status(500).json({ error: error });
  }
}

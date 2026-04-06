// infrastructure/config/dynamo.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";

const region = process.env.AWS_REGION || "us-east-1";
const environment = process.env.NODE_ENV || "dev";

let clientConfig = { region };

if (environment !== "production") {
  clientConfig.credentials = fromEnv();
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

export default docClient;
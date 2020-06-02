import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS  from 'aws-sdk';
import { createLogger } from '../../utils/logger';
import { getTodoItem } from '../businessLogic/todos';

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const logger = createLogger('generateUploadUrl');

const attachmentBucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  logger.info("generateUploadUrl called. ",{
    todoId
  });
  const todoItem = await getTodoItem(todoId);
  if(!todoItem){
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    };
  }else{
    const uploadUrl =  s3.getSignedUrl('putObject',{
      Bucket: attachmentBucketName,
      Key: todoId,
      Expires: urlExpiration
    });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl
      })
    };
  }
}

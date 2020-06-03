import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getTodoItem, getUploadAttachmentUrl } from '../businessLogic/todos';


const logger = createLogger('generateUploadUrl');



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
    const uploadUrl =  await getUploadAttachmentUrl(todoId);
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

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils';
import { getUserTodoItem, deleteTodo , deleteTodoAttachment} from '../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger("deleteTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const todoItem = await getUserTodoItem(userId,todoId);
    if(!todoItem){
      logger.error("Todo not found",{todoId,userId});
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: "Todo Item not found"
        };
    }
    await deleteTodo(userId,todoId);
    await deleteTodoAttachment(todoId);
  }catch(e){
    logger.error("An error occured.", {e})
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "An error occured please try again later."
    };
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
  };
}

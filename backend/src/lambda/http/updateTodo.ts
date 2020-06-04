import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils';
import { updateTodo, getUserTodoItem } from '../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger("updateTodo");
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    logger.info("processing event...",{
      event
    });
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
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
    await updateTodo(updatedTodo,userId,todoId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    };
  }catch(e){
    logger.error("An error occured. ",{
      e
    });
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "An error occured please try again later."
    };
  }
}

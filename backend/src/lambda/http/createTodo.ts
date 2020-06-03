import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("event processing started.",{event});
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);
  const newItem = await createTodo(newTodo, userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  };
}

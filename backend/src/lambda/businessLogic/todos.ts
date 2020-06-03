import * as uuid from 'uuid';
import { TodoItem } from '../../models/TodoItem';
import { TodoAccess } from '../dataLayer/todoAccess';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils';

const todoAccess = new TodoAccess();
const logger = createLogger('todos'); 

export async function getAllTodos(jwtPayload: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtPayload);
  return todoAccess.getUserAllTodos(userId);
}

export async function createTodo(todoItem: CreateTodoRequest, jwtPayload: string ): Promise<TodoItem> {
    logger.info('createTodo called.',{
      todoItem,
      jwtPayload
    });
    const todoId = uuid.v4();
    const userId = parseUserId(jwtPayload);
    const createDate = new Date().toISOString();
    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: todoItem.name,
        createdAt: createDate,
        done: false,
        dueDate: todoItem.dueDate
      });
}

export async function getTodoItem(todoId: string): Promise<TodoItem> {
  logger.info('getTodoItem called.',{
    todoId
  });
  return todoAccess.getTodoItem(todoId);
}

export async function updateTodoAttachmentUrl(todoItem: TodoItem){
  logger.info('updateTodoAttachmentUrl is called.',{
    todoItem
  });
  return await todoAccess.updateTodoAttachmentUrl(todoItem);
}

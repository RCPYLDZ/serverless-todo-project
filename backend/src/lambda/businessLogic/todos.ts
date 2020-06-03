import * as uuid from 'uuid';
import { TodoItem } from '../../models/TodoItem';
import { TodoAccess } from '../dataLayer/todoAccess';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();
const logger = createLogger('todos'); 

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getUserAllTodos(userId);
}

export async function createTodo(todoItem: CreateTodoRequest, userId: string ): Promise<TodoItem> {
    logger.info('createTodo called.',{
      todoItem,
      userId
    });
    const todoId = uuid.v4();
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

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string,todoId: string ): Promise<void> {
  logger.info('updateTodo called.',{
    updateTodoRequest,
    userId,
    todoId
  });
  return await todoAccess.updateTodo(updateTodoRequest,userId,todoId);
}

export async function getTodoItem(todoId: string): Promise<TodoItem> {
  logger.info('getTodoItem called.',{
    todoId
  });
  return await todoAccess.getTodoItem(todoId);
}

export async function getUserTodoItem(userId:string,todoId:string): Promise<TodoItem>{
  logger.info("getUserTodoItem called.",{
    userId,
    todoId
  });
  return await todoAccess.getUserTodoItem(todoId,userId);
}

export async function updateTodoAttachmentUrl(todoItem: TodoItem){
  logger.info('updateTodoAttachmentUrl is called.',{
    todoItem
  });
  return await todoAccess.updateTodoAttachmentUrl(todoItem);
}

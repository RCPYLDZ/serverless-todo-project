import * as uuid from 'uuid';
import { TodoItem } from '../../models/TodoItem';
import { TodoAccess } from '../dataLayer/todoAccess';
import { S3Acceess } from '../resourceLayer/s3Access';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();
const s3Access = new S3Acceess();
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

export async function deleteTodo(userId:string, todoId: string){
  logger.info("deleteTodo is called. ",{
    userId,todoId
  });
  return await todoAccess.deleteTodo(userId,todoId);
}

export async function getUploadAttachmentUrl(todoId:string): Promise<string>{
  return await s3Access.getUploadAttachmentUrl(todoId);
}

export async function deleteTodoAttachment(todoId:string){
  return await s3Access.deleteTodoAttachment(todoId);
}

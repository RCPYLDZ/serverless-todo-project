import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';

import { TodoItem } from '../../models/TodoItem';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
const logger = createLogger('todoAccess'); 
const userIdIndexName = process.env.USER_ID_INDEX;

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getUserAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos');

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: userIdIndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("createTodo called.",{
      todoItem,
      tableName:this.todosTable
    });
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();
    return todoItem;
  }

  async updateTodoAttachmentUrl(todoItem: TodoItem) : Promise<void> {
    logger.info("updateTodoAttachmentUrl is called.",{todoItem});
    var params = {
      TableName:this.todosTable,
      Key:{
          "todoId": todoItem.todoId,
          "userId": todoItem.userId
      },
      UpdateExpression: "set attachmentUrl = :u",
      ExpressionAttributeValues:{
          ":u":todoItem.attachmentUrl,
      }
    };
  
    const result = await this.docClient.update(params).promise();

    logger.info("updateTodoAttachmentUrl is completed.",{result});
  }

  async getTodoItem(todoId: string): Promise<TodoItem> {
    logger.info('getTodoItem called.',{
      todoId
    });
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      },
      ScanIndexForward: false
    }).promise();
    if(result.Items && result.Items.length > 0){
      return Promise.resolve(result.Items[0] as TodoItem);
    }
    else{
      return Promise.resolve(undefined);
    }
  }

  async getUserTodoItem(todoId: string,userId: string): Promise<TodoItem> {
    logger.info('getUserTodoItem called.',{
      todoId,
      userId
    });
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId and userId = :userId',
      ExpressionAttributeValues: {
        ':todoId': todoId,
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise();
    if(result.Items && result.Items.length > 0){
      return Promise.resolve(result.Items[0] as TodoItem);
    }
    else{
      return Promise.resolve(undefined);
    }
  }

  async updateTodo(updateTodoRequest: UpdateTodoRequest,userId: string,todoId: string) : Promise<void> {
    logger.info("updateTodo is called.",{updateTodoRequest});
  
    const result = await this.docClient.update({
      TableName:this.todosTable,
      Key:{
          "todoId": todoId,
          "userId": userId
      },
      UpdateExpression: "set #todoName = :todoName, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
          '#todoName': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
      },
      ExpressionAttributeValues: {
          ":todoName": updateTodoRequest.name,
          ":dueDate": updateTodoRequest.dueDate,
          ":done": updateTodoRequest.done
      },
    }).promise();

    logger.info("updateTodo is completed.",{result});
  }
  async deleteTodo(userId:string,todoId: string): Promise<void> {
    logger.info("deleteTodo is called.",{
      userId,
      todoId
    });
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      }
    }).promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}

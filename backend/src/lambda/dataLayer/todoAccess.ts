import * as AWS  from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';

import { TodoItem } from '../../models/TodoItem';
const logger = createLogger('todoAccess'); 

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos');

    const result = await this.docClient.scan({
      TableName: this.todosTable
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
          "todoId": todoItem.todoId
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
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      }
    }).promise();
    if(result.Item){
      return Promise.resolve(result.Item as TodoItem);
    }
    else{
      return Promise.resolve(undefined);
    }
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }

  return new AWS.DynamoDB.DocumentClient();
}

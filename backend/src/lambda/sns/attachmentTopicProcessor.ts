import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { SNSHandler, SNSEvent } from 'aws-lambda';
import { getTodoItem, updateTodoAttachmentUrl } from '../businessLogic/todos';

const logger = createLogger('attachmentTopicsProcessor');
const bucketName = process.env.ATTACHMENTS_S3_BUCKET;

export const handler: SNSHandler = async(event: SNSEvent) => {
    logger.info('Processing SNS event',{
        event
    });
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message;
        logger.info('Processing S3 event', {s3EventStr});
        const s3Event = JSON.parse(s3EventStr);
        for (const record of s3Event.Records) {
          const todoId = record.s3.object.key;
          const todoItem = await getTodoItem(todoId);
          if(todoItem){
              todoItem.attachmentUrl = getAttachmentUrl(todoId);
              await updateTodoAttachmentUrl(todoItem);
          }else{
              logger.error("TodoItem does not exist.",{todoId});
          }
        }
    }

}

function getAttachmentUrl(todoId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}
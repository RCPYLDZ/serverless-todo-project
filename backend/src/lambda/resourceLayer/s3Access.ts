import * as AWS  from 'aws-sdk';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });
  

const attachmentBucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export class S3Acceess {
 async getUploadAttachmentUrl(todoId:string): Promise<string> {
    const uploadUrl =  s3.getSignedUrl('putObject',{
        Bucket: attachmentBucketName,
        Key: todoId,
        Expires: urlExpiration
      });
    return uploadUrl;
 }

 async deleteTodoAttachment(todoId:string):Promise<void> {
    await s3.deleteObject({
        Bucket: attachmentBucketName,
        Key: todoId
    }).promise();
 }
}
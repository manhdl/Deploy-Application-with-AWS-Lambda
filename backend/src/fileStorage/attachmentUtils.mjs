import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS);
const s3BucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPORATION;

export function getAttachmentUrl(todoId) {
    return `https://${s3BucketName}.s3.amazonaws.com/${todoId}`;
}

export function getUploadUrl(todoId) {
    const s3 = new XAWS.S3({ signatureVersion: 'v4' });

    return s3.getSignedUrl('putObjects', {
        Bucket: s3BucketName,
        Key: todoId,
        Expires: urlExpiration
    });
}
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { createLogger } from "../utils/logger.mjs";

const s3Client = new S3Client();
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
const groupsTable = process.env.TODOS_TABLE;
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());
const logger = createLogger("Attachment");

export async function getUploadUrl(imageId) {
    logger.info("getUploadUrl function is calling ");
    logger.info(`bucket: ${s3BucketName}`);
    const command = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: imageId,
    });

    return await getSignedUrl(s3Client, command, {
        expiresIn: urlExpiration,
    });
}

export async function saveImgUrl(userId, todoId) {
    logger.info("saveImgUrl function is calling ");
    await dynamoDbDocument.update({
        TableName: groupsTable,
        Key: { userId, todoId },
        ConditionExpression: "attribute_exists(todoId)",
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
        },
    });
}
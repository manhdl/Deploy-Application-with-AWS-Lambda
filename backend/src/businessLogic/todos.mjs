import * as uuid from "uuid";
import { getUserId } from "../utils/getJwt";
import {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    saveImgUrl,
} from "../dataLayer/todoAccess";

const todoAccess = new TodoAccess();

export async function getTodos(userId) {
    return todoAccess.getTodos(userId);
}

export async function getTodo(userId, todoId) {
    return todoAccess.getTodo(userId, todoId);
}

export async function createTodo(userId, newTodoData) {
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const done = false;
    const newTodo = { todoId, userId, createdAt, done, ...newTodoData };
    return todoAccess.createTodo(newTodo);
}

export async function updateTodo(userId, todoId, updateData) {
    return todoAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(userId, todoId) {
    return todoAccess.deleteTodo(userId, todoId);
}

export async function generateUploadUrl(userId, todoId) {
    const bucketName = process.env.IMAGES_S3_BUCKET;
    const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
    const s3 = new AWS.S3({ signatureVersion: "v4" });
    const signedUrl = s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration,
    });
    await saveImgUrl(userId, todoId, bucketName);
    return signedUrl;
}
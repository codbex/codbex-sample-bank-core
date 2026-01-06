import { response, request } from "@aerokit/sdk/http";
import { Tasks } from '@aerokit/sdk/bpm';

const taskId = request.getParameter('taskId');
Tasks.complete(taskId)

response.println(`Dummy Task Completed with id = [${taskId}]`);
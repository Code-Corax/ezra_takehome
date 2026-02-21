import axios, {AxiosError} from "axios";
import type { Todo } from "./todoApiModels";

//todo: come back and address config setup for this
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5107';

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export async function getAllTodos(): Promise<Todo[]> {
    try {
        const { data } = await http.get<Todo[]>('/todos')
        return data
    } catch (error) {
        throw toApiError(error)
    }
}

//Todo: revisit making this more specific
function toApiError(error: unknown): Error {
    if (error instanceof AxiosError) {
        const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        'Request failed'
        return new Error(message)
    }
    return error instanceof Error ? error : new Error('Unknown error')
}
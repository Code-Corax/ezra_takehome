export type Todo = {
    id: string
    title: string
    description: string | null
    isDone: boolean
    dateCreated: string
    priority: number
  }

  export type CreateTodoInput = {
    title: string
    description: string
    priority: number
  }

  export type UpdateTodoInput = {
    title: string
    description: string
    priority: number
    isDone: boolean
  }

  export type ToggleIsDoneInput = {
    isDone:  boolean
  }
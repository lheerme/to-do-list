export interface AnonToDo {
  id: string
  title: string
  tasks: {
    id: string
    title: string
    isCompleted: boolean
  }[]
}

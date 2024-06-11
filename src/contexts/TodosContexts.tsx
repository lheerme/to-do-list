import { createContext, ReactNode, useState } from 'react'

interface TodoListProps {
  id: string
  title: string
  slug: string
  todoTasks: {
    title: string
    id: string
    isComplete: boolean
  }[]
}

interface TodoContextProps {
  todoList: TodoListProps[]
  setTodoList: (arg0: TodoListProps[]) => void
}

export const TodosContext = createContext({} as TodoContextProps)

export function TodosContextProvider({ children }: { children: ReactNode }) {
  const [todoList, setTodoList] = useState<TodoListProps[] | []>(() => {
    const listOnStorage = localStorage.getItem('@to-do-list-items')
    if (listOnStorage) {
      return JSON.parse(listOnStorage)
    }

    return []
  })

  return (
    <TodosContext.Provider value={{ todoList, setTodoList }}>
      {children}
    </TodosContext.Provider>
  )
}

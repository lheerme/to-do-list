import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { Dashboard } from '@/pages/app/dashboard/dashboard'
import { ToDoDetailsAnonymous } from '@/pages/app/to-do-details/anonymous'
import { ToDoDetails } from '@/pages/app/to-do-details/to-do-details'
import { SignIn } from '@/pages/auth/sign-in'
import { SignUp } from '@/pages/auth/sign-up'
import { Error } from '@/pages/error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      {
        path: '/list/:toDoId',
        element: <ToDoDetails />,
      },
      {
        path: '/anon-list/:toDoId',
        element: <ToDoDetailsAnonymous />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

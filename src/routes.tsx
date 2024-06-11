import { createBrowserRouter } from 'react-router-dom'

import { AppLayouts } from '@/pages/_layouts/app'
import { Home } from '@/pages/app/Home'
import { List } from '@/pages/app/List'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayouts />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/list/:listSlug',
        element: <List />,
      },
    ],
  },
])

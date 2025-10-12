import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import HelloPage from '../pages/HelloPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HelloPage />
  },
  {
    path: '/about',
    element: <div>About</div>
  },
  {
    path: '/hello',
    element: <HelloPage />
  }
])

export default router
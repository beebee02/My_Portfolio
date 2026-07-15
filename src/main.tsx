import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';  // ✅ Aligned with your router.tsx exports
import './styles.css';

// Initialize the TanStack router instance for the client
const router = getRouter();  // ✅ Matches getRouter()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
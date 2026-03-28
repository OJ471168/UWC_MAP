import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MapPage from './pages/MapPage';
import LandingPage from './pages/LandingPage';
import ThreePrinciplesPage from './pages/ThreePrinciplesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { JoinPage } from './pages/JoinPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'three-principles', element: <ThreePrinciplesPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'join', element: <JoinPage /> },

      // Phase 4: Auth-gated pages (CommunityPage, DashboardPage)
    ],
  },
]);

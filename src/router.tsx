import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MapPage from './pages/MapPage';
import LandingPage from './pages/LandingPage';
import ThreePrinciplesPage from './pages/ThreePrinciplesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { JoinPage } from './pages/JoinPage';
import { CommunityPage } from './pages/CommunityPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthGuard } from './components/auth/AuthGuard';

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
      { path: 'community', element: <AuthGuard><CommunityPage /></AuthGuard> },
      { path: 'dashboard', element: <AuthGuard><DashboardPage /></AuthGuard> },
    ],
  },
]);

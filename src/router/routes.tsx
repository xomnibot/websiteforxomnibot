import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from '@/pages/Home';
import { WriteupsListPage } from '@/pages/Writeups/WriteupsList';
import { WriteupDetailPage } from '@/pages/Writeups/WriteupDetail';
import { ResearchListPage } from '@/pages/Research/ResearchList';
import { ResearchDetailPage } from '@/pages/Research/ResearchDetail';
import { ProjectsListPage } from '@/pages/Projects/ProjectsList';
import { ProjectDetailPage } from '@/pages/Projects/ProjectDetail';
import { BlogListPage } from '@/pages/Blog/BlogList';
import { BlogDetailPage } from '@/pages/Blog/BlogDetail';
import { CheatsheetListPage } from '@/pages/Cheatsheets/CheatsheetList';
import { CheatsheetDetailPage } from '@/pages/Cheatsheets/CheatsheetDetail';
import { YouTubeFeedPage } from '@/pages/YouTube/YouTubeFeed';
import { AboutPage } from '@/pages/About';
import { ContactPage } from '@/pages/Contact';
import { NotFoundPage } from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Writeups Routes */}
      <Route path="/writeups" element={<WriteupsListPage />} />
      <Route path="/writeups/:slug" element={<WriteupDetailPage />} />

      {/* Research Routes */}
      <Route path="/research" element={<ResearchListPage />} />
      <Route path="/research/:slug" element={<ResearchDetailPage />} />

      {/* Projects Routes */}
      <Route path="/projects" element={<ProjectsListPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />

      {/* Blog Routes */}
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />

      {/* Cheat Sheets Routes */}
      <Route path="/cheatsheets" element={<CheatsheetListPage />} />
      <Route path="/cheatsheets/:slug" element={<CheatsheetDetailPage />} />

      {/* YouTube Route */}
      <Route path="/youtube" element={<YouTubeFeedPage />} />

      {/* About & Contact Routes */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

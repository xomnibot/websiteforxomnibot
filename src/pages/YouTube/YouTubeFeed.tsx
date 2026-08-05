import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { YouTubeCard } from '@/components/cards/YouTubeCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { YoutubeIcon } from '@/components/common/SocialIcons';
import { siteConfig } from '@/data/siteConfig';
import { contentService } from '@/services/contentService';

export const YouTubeFeedPage: React.FC = () => {
  const videos = contentService.getYouTubeVideos();

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'YouTube' }]} />

      <SectionHeader
        badge="Video Hub & Tutorials"
        title="xomnibot YouTube Technical Content"
        subtitle="Full video walkthroughs covering Web Application Penetration Testing, Active Directory Exploitation, and Reverse Engineering."
        action={
          <a href={siteConfig.socialLinks.youtube} target="_blank" rel="noreferrer">
            <PrimaryButton icon={<YoutubeIcon className="w-4 h-4 fill-current" />}>
              Subscribe on YouTube
            </PrimaryButton>
          </a>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <YouTubeCard key={video.id} video={video} />
        ))}
      </div>
    </PageContainer>
  );
};

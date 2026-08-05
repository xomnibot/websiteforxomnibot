import React from 'react';
import { YouTubeVideo } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface YouTubeCardProps {
  video: YouTubeVideo;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({ video }) => {
  return (
    <article className="group flex flex-col justify-between rounded-xl glass-panel overflow-hidden border border-border hover:border-red-500/40 transition-all duration-300">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[11px] font-mono rounded">
          {video.duration}
        </span>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <Tag variant="cyan" size="sm">
              {video.category}
            </Tag>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatDate(video.publishedAt)}
            </span>
          </div>

          <h3 className="font-heading font-bold text-base text-foreground group-hover:text-red-400 transition-colors line-clamp-2">
            <a href={video.videoUrl} target="_blank" rel="noreferrer">
              {video.title}
            </a>
          </h3>

          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            Watch on YouTube
          </span>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-red-400 font-medium hover:underline"
          >
            Play Video
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

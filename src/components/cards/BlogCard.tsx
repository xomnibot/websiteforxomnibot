import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl glass-panel p-5 border border-border hover:border-emerald-500/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Tag variant="green" size="sm">
            {post.category}
          </Tag>
          <span className="text-[11px] font-mono text-muted-foreground">
            {formatDate(post.date)}
          </span>
        </div>

        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`}>
            <span className="absolute inset-0 z-10" />
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.summary}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          {post.readingTime}
        </span>
        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
          Read Article
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};

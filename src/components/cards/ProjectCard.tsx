import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/content';
import { Tag } from '@/components/common/Tag';
import { GithubIcon } from '@/components/common/SocialIcons';
import { Code2, Star, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl glass-panel p-5 border border-border hover:border-purple-500/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Tag variant="cyan" size="sm">
            {project.category}
          </Tag>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground z-20">
            {project.stars !== undefined && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {project.stars}
              </span>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="hover:text-foreground transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-purple-400 transition-colors">
          <Link to={`/projects/${project.slug}`}>
            <span className="absolute inset-0 z-10" />
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5 z-20">
          {project.tags.slice(0, 4).map((tag, idx) => (
            <Tag key={idx} variant="gray" size="sm">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          {project.language}
        </span>
        <span className="inline-flex items-center gap-1 text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
          View Project
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};

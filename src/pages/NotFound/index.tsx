import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ShieldAlert, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-lg p-8 rounded-2xl glass-panel border border-border">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full uppercase">
            HTTP 404 • ROUTE UNREACHABLE
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">
            Target Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            The requested URI path does not exist on the xomnibot research server.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <PrimaryButton icon={<Home className="w-4 h-4" />}>
              Return to Primary Lab Base
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

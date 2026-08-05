import { YouTubeVideo } from '@/types/content';

export const sampleYouTubeVideos: YouTubeVideo[] = [
  {
    id: 'yt1',
    videoId: 'dQw4w9WgXcQ', // Placeholder ID for video embeds
    title: 'OAuth 2.0 Flaws Explained: From Redirect URI Traversal to Account Takeover',
    description: 'Deep dive into real-world OAuth authorization bugs, token leakage vectors, and defensive PKCE implementations.',
    category: 'Web Security',
    duration: '24:15',
    publishedAt: '2026-08-02',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'yt2',
    videoId: 'dQw4w9WgXcQ',
    title: 'Active Directory Attack Lab: BloodHound Mastery & DCSync Escalation',
    description: 'Learn how to identify hidden privileges in enterprise AD domains and execute DCSync attacks using Impacket tools.',
    category: 'Active Directory',
    duration: '32:40',
    publishedAt: '2026-07-22',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'yt3',
    videoId: 'dQw4w9WgXcQ',
    title: 'Reverse Engineering Rust Malware Loaders with IDA Pro & x64dbg',
    description: 'Full analysis of modern compiled Rust executables, bypassing anti-debugging checks and dumping dynamic decrypted payloads.',
    category: 'Reverse Engineering',
    duration: '45:10',
    publishedAt: '2026-07-08',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  },
];

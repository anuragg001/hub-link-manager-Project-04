import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function PublicBioPage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axiosClient.get(`/bio/${username}`)
      .then(res => setProfile(res.data.data.bio))
      .catch(() => setError(true));
  }, [username]);

  if (error) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xl">Profile not found</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  const themeClasses = profile.theme === 'dark' 
    ? 'bg-zinc-950 text-white' 
    : profile.theme === 'gradient' 
      ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white' 
      : 'bg-zinc-50 text-zinc-900';

  const buttonClasses = profile.theme === 'dark'
    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
    : profile.theme === 'gradient'
      ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white'
      : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 shadow-sm';

  return (
    <div className={`min-h-screen flex justify-center p-4 sm:p-8 ${themeClasses}`}>
      <div className="w-full max-w-md flex flex-col items-center pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <img src={profile.avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-white/20 shadow-2xl object-cover mb-6" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">{profile.displayName || `@${username}`}</h1>
        <p className={`text-center mb-10 ${profile.theme === 'light' ? 'text-zinc-500' : 'text-white/80'}`}>{profile.bio}</p>
        
        <div className="w-full space-y-4">
          {profile.socialLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noreferrer" className={`block w-full py-4 px-6 rounded-2xl text-center font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonClasses}`}>
              {link.platform}
            </a>
          ))}
        </div>
        
        <a href="/" className={`mt-16 text-xs font-semibold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity ${profile.theme === 'light' ? 'text-zinc-400' : 'text-white/50'}`}>
          Powered by Hub
        </a>
      </div>
    </div>
  );
}

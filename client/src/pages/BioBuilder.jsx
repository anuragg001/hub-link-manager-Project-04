import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Smartphone, ExternalLink, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BioBuilder() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ displayName: '', bio: '', avatarUrl: '', theme: 'light', socialLinks: [] });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get('/bio');
      if (res.data.data.bio) setProfile(res.data.data.bio);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put('/bio', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const addLink = () => {
    setProfile({ ...profile, socialLinks: [...profile.socialLinks, { platform: 'Website', url: '' }] });
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...profile.socialLinks];
    newLinks[index][field] = value;
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const removeLink = (index) => {
    const newLinks = profile.socialLinks.filter((_, i) => i !== index);
    setProfile({ ...profile, socialLinks: newLinks });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bio Builder</h1>
          <p className="text-muted-foreground mt-2">Customize your public Link-in-Bio page.</p>
        </div>
        <Link to={`/bio/${user.username}`} target="_blank">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" /> View Public Page
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Controls */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Info</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input value={profile.avatarUrl} onChange={e => setProfile({...profile, avatarUrl: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-background min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={profile.theme} onValueChange={(v) => setProfile({...profile, theme: v})}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select a theme" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Minimal Light</SelectItem>
                      <SelectItem value="dark">Dark Slate</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gap-2"><Save className="h-4 w-4" /> Save Profile</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Add links to your other profiles.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addLink}><Plus className="h-4 w-4 mr-2" /> Add Link</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                  <Input placeholder="Platform (e.g. Twitter)" value={link.platform} onChange={e => updateLink(i, 'platform', e.target.value)} className="w-1/3 bg-background" />
                  <Input placeholder="URL" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} className="w-2/3 bg-background" />
                  <Button variant="ghost" size="icon" onClick={() => removeLink(i)} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {profile.socialLinks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No social links added yet.</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Preview */}
        <div className="flex justify-center lg:justify-end items-start pt-4 lg:pt-0">
          <div className="relative w-[320px] h-[650px] border-[12px] border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden bg-background ring-4 ring-black/5">
            <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-3xl w-1/2 mx-auto z-20"></div>
            <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
            
            <div className={`h-full w-full overflow-y-auto ${profile.theme === 'dark' ? 'bg-zinc-950 text-white' : profile.theme === 'gradient' ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white' : 'bg-white text-zinc-900'}`}>
              <div className="p-6 flex flex-col items-center pt-16 min-h-full">
                <img src={profile.avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl object-cover mb-4" />
                <h2 className="text-xl font-bold tracking-tight mb-1">{profile.displayName || '@username'}</h2>
                <p className={`text-sm text-center mb-8 ${profile.theme === 'light' ? 'text-zinc-500' : 'text-white/80'}`}>{profile.bio || 'Your bio will appear here.'}</p>
                
                <div className="w-full space-y-3">
                  {profile.socialLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className={`block w-full py-3.5 px-6 rounded-xl text-center font-medium transition-transform hover:scale-105 active:scale-95 shadow-sm ${profile.theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700' : profile.theme === 'gradient' ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white' : 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900'}`}>
                      {link.platform || 'Link'}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

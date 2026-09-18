import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, QrCode, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

export default function LinkLibrary() {
  const [links, setLinks] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [newVanity, setNewVanity] = useState('');
  const [qrCodeLink, setQrCodeLink] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axiosClient.get('/links');
      setLinks(res.data.data.links || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/links', { destinationUrl: newDestination, vanitySlug: newVanity || undefined });
      setNewDestination('');
      setNewVanity('');
      fetchLinks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating link');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axiosClient.delete(`/links/${id}`);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (shortCode) => {
    navigator.clipboard.writeText(`http://localhost:5000/r/${shortCode}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link Library</h1>
        <p className="text-muted-foreground mt-2">Create and manage your branded short links.</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Create New Link</CardTitle>
          <CardDescription>Enter a long URL to instantly shorten it.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">Destination URL</label>
              <Input required type="url" placeholder="https://example.com" value={newDestination} onChange={e => setNewDestination(e.target.value)} className="bg-background" />
            </div>
            <div className="w-full md:w-64 space-y-2">
              <label className="text-sm font-medium">Vanity Slug (Optional)</label>
              <Input placeholder="my-sale" value={newVanity} onChange={e => setNewVanity(e.target.value)} className="bg-background" />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Shorten
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">Short Link</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="w-[100px]">Clicks</TableHead>
              <TableHead className="w-[150px]">Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map(link => (
              <TableRow key={link._id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <a href={`http://localhost:5000/r/${link.shortCode}`} target="_blank" rel="noreferrer" className="text-primary hover:underline transition-all">
                    /r/{link.shortCode}
                  </a>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {link.destinationUrl}
                </TableCell>
                <TableCell className="font-semibold">{link.totalClicks || 0}</TableCell>
                <TableCell className="text-muted-foreground">{format(new Date(link.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyToClipboard(link.shortCode)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setQrCodeLink(link.shortCode)}>
                        <QrCode className="mr-2 h-4 w-4" /> View QR
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(link._id)} className="text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No links found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!qrCodeLink} onOpenChange={(open) => !open && setQrCodeLink(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              {qrCodeLink && <QRCodeSVG value={`http://localhost:5000/r/${qrCodeLink}`} size={200} />}
            </div>
            <p className="text-sm text-muted-foreground break-all text-center">http://localhost:5000/r/{qrCodeLink}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

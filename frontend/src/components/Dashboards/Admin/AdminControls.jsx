import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast.js';
import { Edit, Shield, Plus } from 'lucide-react';

const AdminControls = () => {
  const { toast } = useToast();
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const defaultImgURL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1763711531/default_pfp_w2lnen.jpg`
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    profile_image: defaultImgURL
  });

  const handleInputChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const handleAddAdmin = async () => {
  console.log('Adding new admin:', newAdmin);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAdmin)
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: 'Admin Added',
        description: `${newAdmin.username} has been added as an admin.`,
      });
      // Reset form
      setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
      setShowAddAdmin(false);
    } else {
      // Backend returned an error
      console.error('Error adding admin:', data);
      toast({
        title: 'Failed to Add Admin',
        description: data.Error || 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  } catch (err) {
    // Network or other errors
    console.error('Network error:', err);
    toast({
      title: 'Network Error',
      description: 'Please check your connection and try again.',
      variant: 'destructive',
    });
  }
};


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Accounts & Roles</CardTitle>
              <CardDescription>Manage admin users and their permissions</CardDescription>
            </div>
            <Button onClick={() => setShowAddAdmin(!showAddAdmin)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>
        </CardHeader>

        {showAddAdmin && (
          <CardContent className="border-t border-gray-200 space-y-4">
            <div className="space-y-2">
              <Input
                name="username"
                placeholder="Full Name"
                value={newAdmin.username}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={newAdmin.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={handleInputChange}
              />
              <Button onClick={handleAddAdmin} className="w-full">
                Add Admin
              </Button>
            </div>
          </CardContent>
        )}

        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-sm text-muted-foreground">admin@platform.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge>
                  <Shield className="mr-1 h-3 w-3" />
                  Super Admin
                </Badge>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminControls;

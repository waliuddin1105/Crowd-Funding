import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast.js';
import {
  Edit,
  Shield,
  Plus
} from 'lucide-react';
const AdminControls = () => {
  const { toast } = useToast();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                  </Button>
                </div>
              </CardHeader>
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
  )
}

export default AdminControls

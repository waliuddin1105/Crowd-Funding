import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Eye,
  Trash2,
} from 'lucide-react';

const mockCreators = [
  {
    id: "c1",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    campaigns: 3,
    totalRaised: 45000,
    joinDate: "2024-10-15",
    status: "active",
  },
  {
    id: "c2",
    name: "Mike Chen",
    email: "mike@example.com",
    campaigns: 5,
    totalRaised: 120000,
    joinDate: "2024-08-20",
    status: "active",
  },
];

const mockDonors = [
  {
    id: "d1",
    name: "Emily Johnson",
    email: "emily@example.com",
    totalDonations: 5000,
    campaignsSupported: 8,
    joinDate: "2024-11-05",
    status: "active",
  },
  {
    id: "d2",
    name: "Robert Taylor",
    email: "robert@example.com",
    totalDonations: 12000,
    campaignsSupported: 15,
    joinDate: "2024-09-10",
    status: "active",
  },
];
const UsersTab = () => {

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
      {/* Creators */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Creators</CardTitle>
          <CardDescription>Registered creators and their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Total Raised</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreators.map((creator) => (
                <TableRow key={creator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} />
                        <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{creator.name}</div>
                        <div className="text-sm text-muted-foreground">{creator.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{creator.campaigns}</TableCell>
                  <TableCell>{formatCurrency(creator.totalRaised)}</TableCell>
                  <TableCell>{formatDate(creator.joinDate)}</TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Donors */}
      <Card>
        <CardHeader>
          <CardTitle>Donors</CardTitle>
          <CardDescription>Registered donors and their contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Total Donations</TableHead>
                <TableHead>Campaigns Supported</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`} />
                        <AvatarFallback>{donor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-sm text-muted-foreground">{donor.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(donor.totalDonations)}</TableCell>
                  <TableCell>{donor.campaignsSupported}</TableCell>
                  <TableCell>{formatDate(donor.joinDate)}</TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

export default UsersTab

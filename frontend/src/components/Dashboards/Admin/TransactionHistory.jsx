import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
const mockTransactions = [
  {
    id: "t1",
    type: "donation",
    donor: "Emily Johnson",
    campaign: "Community Food Bank",
    amount: 500,
    date: "2025-01-15 14:30",
    status: "completed",
  },
  {
    id: "t2",
    type: "donation",
    donor: "Robert Taylor",
    campaign: "Disaster Relief Fund",
    amount: 1000,
    date: "2025-01-15 12:15",
    status: "completed",
  },
];



const TransactionHistory = () => {

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
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>All platform transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <Badge variant="outline">{transaction.type}</Badge>
                              </TableCell>
                              <TableCell>{transaction.donor}</TableCell>
                              <TableCell>{transaction.campaign}</TableCell>
                              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>
                                <Badge variant="default">{transaction.status}</Badge>
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

export default TransactionHistory

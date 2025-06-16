import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ShoppingCart, DollarSign, Clock, Users } from 'lucide-react';
import { LaunchProject } from '../../../../types/launch';

interface OfferCardProps {
  offer: any; // Replace 'any' with a more specific type if available
  launchProject?: LaunchProject;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, launchProject }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {offer.name}
          <Badge variant="secondary">
            <DollarSign className="mr-2 h-4 w-4" />
            {offer.price}
          </Badge>
        </CardTitle>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center">
          <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
          Total Units Sold: {offer.unitsSold || 'N/A'}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          Average Conversion Time: {offer.conversionTime || 'N/A'}
        </div>
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          Customer Satisfaction: {offer.customerSatisfaction || 'N/A'}
        </div>
        <Button>View Offer Details</Button>
      </CardContent>
    </Card>
  );
};

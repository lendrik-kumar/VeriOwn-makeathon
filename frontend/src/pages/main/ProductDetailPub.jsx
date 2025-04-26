import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProductInfo } from '../../utils/ApiServices';
import { Box, Card, CardContent, Typography, Divider, Chip, Grid, CircularProgress, Alert } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';


const ProductDetailsPub = () => {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        setLoading(true);
        const data = await getPublicProductInfo(id);
        setProductInfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product info:', err);
        setError(err.error || 'Failed to load product information');
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [id]);

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'registration':
        return <TimelineDot color="primary" />;
      case 'ownership_transfer':
        return <TimelineDot color="secondary" />;
      case 'repair':
        return <TimelineDot color="warning" />;
      default:
        return <TimelineDot />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Product Details
            </Typography>
            {productInfo?.verification_status === 'authentic' ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Authentic Product"
                color="success"
                variant="outlined"
              />
            ) : (
              <Chip
                icon={<WarningIcon />}
                label="Verification Issues"
                color="error"
                variant="outlined"
              />
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">Manufacturer</Typography>
              <Typography variant="h6" gutterBottom>{productInfo?.product?.manufacturer}</Typography>
              
              <Typography variant="subtitle1" color="text.secondary">Model</Typography>
              <Typography variant="h6" gutterBottom>{productInfo?.product?.model}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">Serial Number</Typography>
              <Typography variant="h6" gutterBottom>{productInfo?.product?.serial_number}</Typography>
              
              <Typography variant="subtitle1" color="text.secondary">Manufacturing Date</Typography>
              <Typography variant="h6" gutterBottom>{productInfo?.product?.manufacturing_date}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Product History</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {productInfo?.history?.length > 0 ? (
            <Timeline position="alternate">
              {productInfo.history.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    {getEventIcon(event.event_type)}
                    {index < productInfo.history.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" component="h3">
                        {event.event_type === 'registration' && 'Product Registration'}
                        {event.event_type === 'ownership_transfer' && 'Ownership Transfer'}
                        {event.event_type === 'repair' && 'Product Repair'}
                        {!['registration', 'ownership_transfer', 'repair'].includes(event.event_type) && 
                          event.event_type.replace('_', ' ').charAt(0).toUpperCase() + event.event_type.slice(1)}
                      </Typography>
                      <Typography color="text.secondary">{formatDate(event.created_at)}</Typography>
                      {event.repair_details && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {event.repair_details}
                        </Typography>
                      )}
                      {event.details && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {event.details}
                        </Typography>
                      )}
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          ) : (
            <Typography variant="body1">No history records available for this product.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailsPub;

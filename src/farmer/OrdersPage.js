import React, { useState, useEffect } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box , Chip
    ,Divider,
    Tabs,
    Tab,
    Stack,
    Button,
    
 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';

const Orders = ({ orders }) => {
    const [filterStatus, setFilterStatus] = useState('PENDING');
  
    const handleChange = (event, newValue) => {
      setFilterStatus(newValue);
    };
  
    const filteredOrders = orders.filter(order => {
      if (filterStatus === 'ALL') return true;
      return order.orderStatus === filterStatus;
    });
    const pendingCount = orders.filter(order => order.orderStatus === 'PENDING').length;
  const completedCount = orders.filter(order => order.orderStatus === 'COMPLETED').length;
  const allCount = orders.length;
  
    return (
  <Box sx={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
    {/* Page Title */}
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center'}}>
      Orders
    </Typography>

    {/* Divider */}
    <Divider />

    {/* Tabs for Filtering Orders */}
    <Tabs
      value={filterStatus}
      onChange={handleChange}
      aria-label="order status tabs"
      centered
      sx={{ mb: 4 }}
    >
      <Tab label={`Pending (${pendingCount})`} value="PENDING" />
        <Tab label={`Completed (${completedCount})`} value="COMPLETED" />
        <Tab label={`All (${allCount})`} value="ALL" />
    </Tabs>

    {/* Orders List */}
    {filteredOrders.map((order) => (
      <Accordion key={order.orderId} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${order.orderId}-content`}
          id={`panel${order.orderId}-header`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
            '& .MuiAccordionSummary-content': {
              margin: '0 !important',
            },
          }}
        >
          {/* Order ID */}
          <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {`${order.productName}`}
          </Typography>

          {/* Product and Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 2 }}>
            <Typography variant="body2" color="text.secondary">{`Qty: ${order.quantity}`}</Typography>
          </Box>

          {/* Order Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
            <Chip
              label={order.orderStatus}
              color={order.orderStatus === 'PENDING' ? 'warning' : 'success'}
              size="small"
            />
          </Box>
        </AccordionSummary>

        {/* Order Details */}
        <AccordionDetails sx={{ bgcolor: 'background.default', padding: 2 }}>
            <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Customer:</strong> {order.customerName}
            <br />
            <strong>Product:</strong> {order.productName}
            <br />
            <strong>Quantity:</strong> {order.quantity}
            <br />
            <strong>Total Price:</strong> {order.totalPrice}
            <br />
            <strong>Status:</strong> {order.orderStatus}
          </Typography>
          <Stack alignContent={'end'}>
          <Button variant='outlined' sx={{
            maxHeight:'30px'
          }}>
            MARK AS COMPLETED
          </Button>
          </Stack>
          
            </Stack>
          
        </AccordionDetails>
      </Accordion>
    ))}
  </Box>
);

  };

// Example usage in a component or page
const OrdersPage = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchAllOrders(token);
    }
  }, [token]);

  const fetchAllOrders = async (token) => {
    try {
      const response = await fetch('http://localhost:5456/farmers/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data); // Log the fetched data for debugging
      if (response.ok && data.status === 200) { // Changed to 200 as per your API response status
        setOrders(data.addOrderResposeList || []);
        console.log(orders); // Note: logging orders here might show the old state due to async nature
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching all orders:', error);
      alert('Failed to fetch orders. Please try again.');
    }
  };

  return <><NavBar></NavBar><Orders orders={orders} /></>;
};

export default OrdersPage;
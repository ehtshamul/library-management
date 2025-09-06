// BorrowDashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTrendingBooks } from "../store/Borrow";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  IconButton,
  Divider,
  Paper,
  alpha,
  Fade,
  Skeleton,
  Container,
  Button,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  MenuBook,
  Assignment,
  MoreVert,
  Analytics,
  LibraryBooks,
  AssignmentReturn,
  Schedule,
  Refresh,
  Download,
  FilterList,
} from "@mui/icons-material";

const BorrowTrend = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [borrowData, setBorrowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const borrowState = useSelector((state) => state.borrow);

  console.log("Borrow State from Redux:", borrowState);

  // ✅ Fetch borrow data (keeping your existing logic)
  useEffect(() => {
    setLoading(true);

    dispatch(getTrendingBooks())
      .unwrap()
      .then((data) => {
        console.log("Fetched Borrow Data:", data);
        // API returns { message, data: [...] }
        setBorrowData(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setBorrowData([]);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await dispatch(getTrendingBooks()).unwrap();
      setBorrowData(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Refresh Error:", err);
    }
    setRefreshing(false);
  };

  console.log("Raw Borrow Data:", borrowData);

  // 1️⃣ Top Borrowed Books (keeping your existing logic)
  const bookCounts = (borrowData || []).reduce((acc, item) => {
    const title = item.book?.title || "Unknown Book";
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const bookChartData = Object.entries(bookCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 2️⃣ Borrow Trend by Date (keeping your existing logic)
  const trendCounts = (borrowData || []).reduce((acc, item) => {
    if (item.borrowdate) {
      const date = new Date(item.borrowdate);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
    }
    return acc;
  }, {});

  const trendChartData = Object.entries(trendCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(`2025/${a.date}`) - new Date(`2025/${b.date}`));

  // 3️⃣ Status Analysis (keeping your existing logic)
  const statusAnalysis = (borrowData || []).reduce((acc, item) => {
    const actualStatus = item.returnDate ? "returned" : "borrowed";
    acc[actualStatus] = (acc[actualStatus] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusAnalysis).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  );

  // Stats (keeping your existing logic)
  const totalBooks = borrowData.length;
  const uniqueBooks = Object.keys(bookCounts).length;
  const returnedCount = (borrowData || []).filter(
    (item) => item.status === "returned" && item.returnDate.trim() !== ""
  ).length;
  const borrowedCount = (borrowData || []).filter(
    (item) => !item.returnDate || item.returnDate.trim() === ""
  ).length;
  const returnRate =
    totalBooks > 0 ? ((returnedCount / totalBooks) * 100).toFixed(1) : 0;

  const COLORS = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  // Enhanced Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" fontWeight="600" color="primary">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Count: {payload[0].value}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Container maxWidth="xl">
      <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={500} height={30} sx={{ mb: 4 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          py: 4,
        }}
      >
        <LoadingSkeleton />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Fade in timeout={1000}>
          <Box>
            {/* Enhanced Header */}
            <Box sx={{ mb: 6 }}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                spacing={3} 
                mb={3}
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    >
                      <Analytics sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h3"
                        fontWeight="700"
                        sx={{
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: 0.5,
                        }}
                      >
                        Library Analytics
                      </Typography>
                      <Typography variant="h6" color="text.secondary" fontWeight="400">
                        Comprehensive Insights Dashboard
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2}>
                 
                 
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    Refresh
                  </Button>
                </Stack>
              </Stack>

              {refreshing && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 700, lineHeight: 1.6 }}
              >
                Track borrowing patterns, analyze popular books, monitor return rates, and gain insights 
                into library usage trends with real-time data visualization.
              </Typography>
            </Box>

            {/* Enhanced Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {/* Total Borrows */}
              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1200}>
                  <Card
                    elevation={0}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 4,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[12],
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.1),
                      }}
                    />
                    <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <LibraryBooks sx={{ fontSize: 40, opacity: 0.9 }} />
                          <Chip 
                            label="Active" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha('#fff', 0.2), 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        </Stack>
                        <Box>
                          <Typography variant="h3" fontWeight="800" gutterBottom>
                            {totalBooks.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            Total Borrow Records
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Unique Books */}
              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1400}>
                  <Card
                    elevation={0}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 4,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[12],
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.1),
                      }}
                    />
                    <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <MenuBook sx={{ fontSize: 40, opacity: 0.9 }} />
                          <Chip 
                            label="Catalog" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha('#fff', 0.2), 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        </Stack>
                        <Box>
                          <Typography variant="h3" fontWeight="800" gutterBottom>
                            {uniqueBooks.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            Unique Book Titles
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Return Rate */}
              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1600}>
                  <Card
                    elevation={0}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 4,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[12],
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.1),
                      }}
                    />
                    <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <AssignmentReturn sx={{ fontSize: 40, opacity: 0.9 }} />
                          <Chip 
                            label="Success" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha('#fff', 0.2), 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        </Stack>
                        <Box>
                          <Typography variant="h3" fontWeight="800" gutterBottom>
                            {returnRate}%
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            Return Rate
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Still Borrowed */}
              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1800}>
                  <Card
                    elevation={0}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 4,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[12],
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.1),
                      }}
                    />
                    <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Schedule sx={{ fontSize: 40, opacity: 0.9 }} />
                          <Chip 
                            label="Pending" 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha('#fff', 0.2), 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        </Stack>
                        <Box>
                          <Typography variant="h3" fontWeight="800" gutterBottom>
                            {borrowedCount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            Currently Borrowed
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>

            {/* Enhanced Charts */}
            <Grid container spacing={4}>
              {/* Top Borrowed Books */}
              <Grid item xs={12} lg={8}>
                <Fade in timeout={2000}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 4, 
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={3}
                      >
                        <Box>
                          <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                            📊 Most Popular Books
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Top 10 books by borrow frequency
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={`${bookChartData.length} Books`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`${totalBooks} Total Borrows`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </Stack>
                        </Box>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Stack>
                      
                      <Divider sx={{ mb: 4, background: alpha(theme.palette.primary.main, 0.1) }} />
                      
                      <ResponsiveContainer width="100%" height={380}>
                        <BarChart
                          data={bookChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                        >
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.9}/>
                              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.6}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={alpha(theme.palette.text.primary, 0.08)}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="title"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={12}
                            stroke={theme.palette.text.secondary}
                            interval={0}
                            tick={{ fontWeight: 500 }}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary} 
                            fontSize={12}
                            tick={{ fontWeight: 500 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="count"
                            fill="url(#barGradient)"
                            radius={[6, 6, 0, 0]}
                            stroke={theme.palette.primary.main}
                            strokeWidth={1}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Enhanced Status Distribution */}
              <Grid item xs={12} lg={4}>
                <Fade in timeout={2200}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 4, 
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      height: 'fit-content'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={3}
                      >
                        <Box width="100%">
                          <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                            📈 Status Overview
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Current borrowing status distribution
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip
                                label={`${returnedCount} Returned`}
                                size="small"
                                color="success"
                                variant="filled"
                                sx={{ fontWeight: 600 }}
                              />
                              <Chip
                                label={`${borrowedCount} Active`}
                                size="small"
                                color="warning"
                                variant="filled"
                                sx={{ fontWeight: 600 }}
                              />
                            </Stack>
                          </Box>
                        </Box>
                        <IconButton 
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Stack>
                      
                      <Divider sx={{ mb: 4, background: alpha(theme.palette.success.main, 0.1) }} />
                      
                      {statusChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <defs>
                              {COLORS.map((color, index) => (
                                <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
                                  <stop offset="95%" stopColor={color} stopOpacity={0.7}/>
                                </linearGradient>
                              ))}
                            </defs>
                            <Pie
                              data={statusChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={100}
                              paddingAngle={4}
                              label={({ name, value, percent }) =>
                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                              }
                              labelLine={false}
                              fontSize={12}
                              fontWeight={600}
                            >
                              {statusChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#pieGradient${index})`}
                                  stroke={theme.palette.background.paper}
                                  strokeWidth={3}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box
                          sx={{
                            height: 300,
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha(theme.palette.action.hover, 0.5),
                            borderRadius: 2,
                            border: `2px dashed ${alpha(theme.palette.text.secondary, 0.3)}`
                          }}
                        >
                          <Assignment sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            No status data available
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Borrowing Trend Line Chart */}
              {trendChartData.length > 0 && (
                <Grid item xs={12}>
                  <Fade in timeout={2400}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 4, 
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={3}
                        >
                          <Box>
                            <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                              📅 Borrowing Trends
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Daily borrowing activity over time
                            </Typography>
                            <Chip
                              label={`${trendChartData.length} Active Days`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          </Box>
                          <IconButton 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>
                        
                        <Divider sx={{ mb: 4, background: alpha(theme.palette.info.main, 0.1) }} />
                        
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={trendChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0.05}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid 
                              strokeDasharray="3 3" 
                              stroke={alpha(theme.palette.text.primary, 0.08)}
                              horizontal={true}
                              vertical={false}
                            />
                            <XAxis 
                              dataKey="date" 
                              stroke={theme.palette.text.secondary}
                              fontSize={12}
                              tick={{ fontWeight: 500 }}
                            />
                            <YAxis 
                              stroke={theme.palette.text.secondary}
                              fontSize={12}
                              tick={{ fontWeight: 500 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke={theme.palette.info.main}
                              strokeWidth={3}
                              fill="url(#areaGradient)"
                              dot={{ fill: theme.palette.info.main, strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: theme.palette.info.main, strokeWidth: 2 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              )}
            </Grid>

            {/* Quick Stats Summary */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <Fade in timeout={2600}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 4, 
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" fontWeight="700" gutterBottom color="primary" sx={{ mb: 3 }}>
                        📊 Quick Summary
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight="800" color="primary">
                              {((returnedCount / totalBooks) * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Books Returned Successfully
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight="800" color="secondary">
                              {Math.round(totalBooks / uniqueBooks)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Average Borrows per Book
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight="800" color="success.main">
                              {bookChartData[0]?.count || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Most Popular Book Count
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight="800" color="warning.main">
                              {trendChartData.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                              Active Borrowing Days
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        justifyContent="center" 
                        alignItems="center" 
                        spacing={2}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Last updated: {new Date().toLocaleString()}
                        </Typography>
                        <Chip 
                          label="Real-time Data" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default BorrowTrend;
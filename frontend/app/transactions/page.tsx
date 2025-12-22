// app/transactions/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Color Palette
  const colors = darkMode ? {
    primary: '#3b82f6',
    secondary: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
    orange: '#f97316',
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    overlay: '#00000040',
    borrow: '#3b82f6',
    return: '#10b981',
    renew: '#8b5cf6',
    fine: '#f59e0b',
  } : {
    primary: '#2563eb',
    secondary: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    purple: '#7c3aed',
    pink: '#db2777',
    teal: '#0d9488',
    orange: '#ea580c',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    overlay: '#00000020',
    borrow: '#2563eb',
    return: '#059669',
    renew: '#7c3aed',
    fine: '#d97706',
  };

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      transactionId: 'TXN001',
      type: 'borrow',
      memberName: 'John Doe',
      memberId: 'MEM2024001',
      bookTitle: 'The Great Gatsby',
      bookId: 'BK001',
      date: '2024-01-29 10:30',
      dueDate: '2024-02-12',
      status: 'active',
      fineAmount: 0,
      amount: 0,
      processedBy: 'Admin',
      notes: 'Regular borrow',
    },
    {
      id: 2,
      transactionId: 'TXN002',
      type: 'return',
      memberName: 'Jane Smith',
      memberId: 'MEM2024002',
      bookTitle: '1984',
      bookId: 'BK002',
      date: '2024-01-29 09:15',
      dueDate: '2024-02-05',
      status: 'completed',
      fineAmount: 50,
      amount: 50,
      processedBy: 'Librarian',
      notes: 'Paid fine ₹50',
    },
    {
      id: 3,
      transactionId: 'TXN003',
      type: 'renew',
      memberName: 'Bob Johnson',
      memberId: 'MEM2024003',
      bookTitle: 'Python Crash Course',
      bookId: 'BK003',
      date: '2024-01-28 16:45',
      dueDate: '2024-02-11',
      status: 'completed',
      fineAmount: 0,
      amount: 20,
      processedBy: 'Admin',
      notes: 'Extended by 2 weeks',
    },
    {
      id: 4,
      transactionId: 'TXN004',
      type: 'borrow',
      memberName: 'Alice Brown',
      memberId: 'MEM2024004',
      bookTitle: 'Pride and Prejudice',
      bookId: 'BK004',
      date: '2024-01-28 14:20',
      dueDate: '2024-02-11',
      status: 'active',
      fineAmount: 0,
      amount: 0,
      processedBy: 'Assistant',
      notes: '',
    },
    {
      id: 5,
      transactionId: 'TXN005',
      type: 'fine',
      memberName: 'Charlie Wilson',
      memberId: 'MEM2024005',
      bookTitle: 'Clean Code',
      bookId: 'BK005',
      date: '2024-01-27 11:10',
      dueDate: '2024-01-20',
      status: 'completed',
      fineAmount: 100,
      amount: 100,
      processedBy: 'Admin',
      notes: 'Late return fine',
    },
    {
      id: 6,
      transactionId: 'TXN006',
      type: 'return',
      memberName: 'David Miller',
      memberId: 'MEM2024006',
      bookTitle: 'To Kill a Mockingbird',
      bookId: 'BK006',
      date: '2024-01-26 15:30',
      dueDate: '2024-01-26',
      status: 'completed',
      fineAmount: 0,
      amount: 0,
      processedBy: 'Librarian',
      notes: 'On time return',
    },
    {
      id: 7,
      transactionId: 'TXN007',
      type: 'borrow',
      memberName: 'Emma Wilson',
      memberId: 'MEM2024007',
      bookTitle: 'The Design of Everyday Things',
      bookId: 'BK007',
      date: '2024-01-25 13:45',
      dueDate: '2024-02-08',
      status: 'active',
      fineAmount: 0,
      amount: 0,
      processedBy: 'Assistant',
      notes: '',
    },
    {
      id: 8,
      transactionId: 'TXN008',
      type: 'fine',
      memberName: 'Frank Harris',
      memberId: 'MEM2024008',
      bookTitle: 'The Catcher in the Rye',
      bookId: 'BK008',
      date: '2024-01-24 10:00',
      dueDate: '2024-01-17',
      status: 'pending',
      fineAmount: 70,
      amount: 0,
      processedBy: 'System',
      notes: 'Awaiting payment',
    },
    {
      id: 9,
      transactionId: 'TXN009',
      type: 'renew',
      memberName: 'Grace Lee',
      memberId: 'MEM2024009',
      bookTitle: 'Atomic Habits',
      bookId: 'BK009',
      date: '2024-01-23 16:20',
      dueDate: '2024-02-06',
      status: 'completed',
      fineAmount: 0,
      amount: 20,
      processedBy: 'Admin',
      notes: 'Extended once',
    },
    {
      id: 10,
      transactionId: 'TXN010',
      type: 'return',
      memberName: 'Henry Taylor',
      memberId: 'MEM2024010',
      bookTitle: 'Sapiens: A Brief History',
      bookId: 'BK010',
      date: '2024-01-22 09:30',
      dueDate: '2024-01-22',
      status: 'completed',
      fineAmount: 0,
      amount: 0,
      processedBy: 'Librarian',
      notes: 'Early return',
    },
  ];

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || transaction.status === selectedStatus;
    
    // Date filtering (simplified)
    const transactionDate = new Date(transaction.date.split(' ')[0]);
    const today = new Date();
    const lastWeek = new Date(today.setDate(today.getDate() - 7));
    
    let matchesDate = true;
    if (dateRange === 'Today') {
      const todayStr = new Date().toISOString().split('T')[0];
      matchesDate = transaction.date.startsWith(todayStr);
    } else if (dateRange === 'Week') {
      matchesDate = transactionDate >= lastWeek;
    } else if (dateRange === 'Month') {
      const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
      matchesDate = transactionDate >= lastMonth;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Get unique types and statuses
  const types = ['All', 'borrow', 'return', 'renew', 'fine'];
  const statuses = ['All', 'active', 'completed', 'pending', 'cancelled'];

  // Calculate stats
  const totalTransactions = mockTransactions.length;
  const todayTransactions = mockTransactions.filter(t => t.date.startsWith('2024-01-29')).length;
  const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const activeBorrows = mockTransactions.filter(t => t.type === 'borrow' && t.status === 'active').length;
  const pendingFines = mockTransactions.filter(t => t.type === 'fine' && t.status === 'pending').length;
  const totalFines = mockTransactions.filter(t => t.type === 'fine').reduce((sum, t) => sum + t.fineAmount, 0);

  // Styles
  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap' as const,
      gap: '16px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0',
    },
    subtitle: {
      fontSize: '16px',
      color: colors.textSecondary,
      marginTop: '8px',
    },
    button: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: `0 4px 6px ${colors.overlay}`,
    },
    secondaryButton: {
      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.teal})`,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: `0 4px 6px ${colors.overlay}`,
    },
    outlineButton: {
      padding: '12px 24px',
      border: `2px solid ${colors.primary}`,
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: colors.primary,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      marginBottom: '24px',
      border: `1px solid ${colors.border}`,
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: colors.text,
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    statCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.2s',
    },
    statTitle: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: '0 0 12px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0',
    },
    searchContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap' as const,
    },
    searchInput: {
      flex: 1,
      minWidth: '300px',
      padding: '14px 20px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: colors.cardBg,
      color: colors.text,
      transition: 'all 0.2s',
    },
    filterContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap' as const,
    },
    filterButton: {
      padding: '10px 20px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      backgroundColor: colors.cardBg,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: colors.textSecondary,
    },
    activeFilter: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
      color: 'white',
      borderColor: colors.primary,
      transform: 'translateY(-2px)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      padding: '16px',
      textAlign: 'left' as const,
      borderBottom: `2px solid ${colors.border}`,
      fontSize: '13px',
      fontWeight: 600,
      color: colors.textSecondary,
      backgroundColor: darkMode ? '#374151' : '#f9fafb',
    },
    td: {
      padding: '16px',
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '14px',
      color: colors.text,
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    typeBadge: (type: string) => ({
      background: `linear-gradient(135deg, ${
        type === 'borrow' ? colors.borrow :
        type === 'return' ? colors.return :
        type === 'renew' ? colors.renew :
        colors.fine
      }, ${
        type === 'borrow' ? colors.borrow :
        type === 'return' ? colors.return :
        type === 'renew' ? colors.renew :
        colors.fine
      }dd)`,
      color: 'white',
    }),
    statusBadge: (status: string) => ({
      background: `linear-gradient(135deg, ${
        status === 'active' ? colors.primary :
        status === 'completed' ? colors.secondary :
        status === 'pending' ? colors.warning :
        colors.danger
      }, ${
        status === 'active' ? colors.primary :
        status === 'completed' ? colors.secondary :
        status === 'pending' ? colors.warning :
        colors.danger
      }dd)`,
      color: 'white',
    }),
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '24px',
    },
    transactionCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s',
    },
    transactionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    transactionId: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.text,
      margin: '0',
    },
    transactionDetails: {
      display: 'grid',
      gap: '12px',
      marginBottom: '20px',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: '13px',
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: '14px',
      fontWeight: 500,
      color: colors.text,
    },
    amountBox: {
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    smallButton: {
      flex: 1,
      padding: '10px',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      backgroundColor: colors.cardBg,
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.textSecondary,
    },
    chartContainer: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      marginBottom: '24px',
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
  };

  // Get transaction type icon
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'borrow': return '📖';
      case 'return': return '↩️';
      case 'renew': return '🔄';
      case 'fine': return '💰';
      default: return '📋';
    }
  };

  // Get transaction type label
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'borrow': return 'Book Borrowed';
      case 'return': return 'Book Returned';
      case 'renew': return 'Book Renewed';
      case 'fine': return 'Fine Payment';
      default: return 'Transaction';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedStatus('All');
    setDateRange('All');
  };

  // Handle export
  const handleExport = () => {
    alert(`Exporting ${filteredTransactions.length} transactions...`);
  };

  // Handle print
  const handlePrint = () => {
    alert('Printing transaction report...');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Transaction History</h1>
          <p style={styles.subtitle}>
            Track all library transactions, fines, and book movements
            <span style={{ 
              marginLeft: '12px', 
              fontSize: '14px', 
              padding: '4px 12px', 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.purple}20)`,
              borderRadius: '20px',
              border: `1px solid ${colors.primary}40`
            }}>
              {totalTransactions} total transactions
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              ...styles.outlineButton,
              borderColor: colors.warning,
              color: colors.warning,
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button 
            onClick={handleExport}
            style={styles.secondaryButton}
          >
            📥 Export Data
          </button>
          <button 
            onClick={handlePrint}
            style={styles.button}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📊 Total Transactions</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {totalTransactions}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>{todayTransactions} today</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>💰 Total Revenue</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.teal})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ₹{totalRevenue}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>₹{totalFines} from fines</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📖 Active Borrows</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.borrow}, #1d4ed8)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {activeBorrows}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>Currently issued</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>⏰ Pending Fines</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.fine}, ${colors.warning})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {pendingFines}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>Awaiting payment</span>
          </div>
        </div>
      </div>

      {/* Chart/Overview */}
      <div style={styles.chartContainer}>
        <div style={styles.chartHeader}>
          <h2 style={styles.sectionTitle}>
            📈 Transaction Overview
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setViewMode('table')}
              style={{
                ...styles.filterButton,
                ...(viewMode === 'table' ? styles.activeFilter : {})
              }}
            >
              📋 Table View
            </button>
            <button 
              onClick={() => setViewMode('card')}
              style={{
                ...styles.filterButton,
                ...(viewMode === 'card' ? styles.activeFilter : {})
              }}
            >
              🃏 Card View
            </button>
          </div>
        </div>
        
        {/* Transaction Type Breakdown */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          flexWrap: 'wrap' 
        }}>
          {types.filter(t => t !== 'All').map(type => {
            const count = mockTransactions.filter(t => t.type === type).length;
            const percentage = Math.round((count / totalTransactions) * 100);
            
            return (
              <div key={type} style={{
                flex: 1,
                minWidth: '120px',
                padding: '16px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${
                  type === 'borrow' ? colors.borrow + '20' :
                  type === 'return' ? colors.return + '20' :
                  type === 'renew' ? colors.renew + '20' :
                  colors.fine + '20'
                }, transparent)`,
                border: `1px solid ${
                  type === 'borrow' ? colors.borrow + '40' :
                  type === 'return' ? colors.return + '40' :
                  type === 'renew' ? colors.renew + '40' :
                  colors.fine + '40'
                }`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{getTypeIcon(type)}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: type === 'borrow' ? colors.borrow :
                           type === 'return' ? colors.return :
                           type === 'renew' ? colors.renew :
                           colors.fine
                  }}>
                    {getTypeLabel(type)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{count}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: colors.textSecondary,
                    background: colors.cardBg,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={styles.sectionTitle}>
            🔍 Filter Transactions
          </h2>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={styles.outlineButton}
          >
            {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
          </button>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by transaction ID, member, book, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button 
            onClick={resetFilters}
            style={styles.outlineButton}
          >
            🔄 Reset All
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ 
            padding: '24px', 
            backgroundColor: darkMode ? '#374151' : '#f9fafb',
            borderRadius: '12px',
            marginTop: '16px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {/* Type Filter */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                  Transaction Type
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      style={{
                        ...styles.filterButton,
                        ...(selectedType === type ? {
                          background: `linear-gradient(135deg, ${
                            type === 'All' ? colors.primary :
                            type === 'borrow' ? colors.borrow :
                            type === 'return' ? colors.return :
                            type === 'renew' ? colors.renew :
                            colors.fine
                          }, ${
                            type === 'All' ? colors.purple :
                            type === 'borrow' ? colors.borrow :
                            type === 'return' ? colors.return :
                            type === 'renew' ? colors.renew :
                            colors.fine
                          })`,
                          color: 'white',
                          borderColor: type === 'All' ? colors.primary :
                                    type === 'borrow' ? colors.borrow :
                                    type === 'return' ? colors.return :
                                    type === 'renew' ? colors.renew :
                                    colors.fine,
                        } : {})
                      }}
                    >
                      {type === 'All' ? 'All Types' : getTypeIcon(type) + ' ' + getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                  Status
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      style={{
                        ...styles.filterButton,
                        ...(selectedStatus === status ? {
                          background: `linear-gradient(135deg, ${
                            status === 'All' ? colors.primary :
                            status === 'active' ? colors.primary :
                            status === 'completed' ? colors.secondary :
                            status === 'pending' ? colors.warning :
                            colors.danger
                          }, ${
                            status === 'All' ? colors.purple :
                            status === 'active' ? colors.primary :
                            status === 'completed' ? colors.secondary :
                            status === 'pending' ? colors.warning :
                            colors.danger
                          })`,
                          color: 'white',
                          borderColor: status === 'All' ? colors.primary :
                                    status === 'active' ? colors.primary :
                                    status === 'completed' ? colors.secondary :
                                    status === 'pending' ? colors.warning :
                                    colors.danger,
                        } : {})
                      }}
                    >
                      {status === 'All' ? 'All Status' : 
                       status === 'active' ? '🟢 Active' :
                       status === 'completed' ? '✅ Completed' :
                       status === 'pending' ? '🟡 Pending' : '🔴 Cancelled'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                  Date Range
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['All', 'Today', 'Week', 'Month'].map(range => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      style={{
                        ...styles.filterButton,
                        ...(dateRange === range ? styles.activeFilter : {})
                      }}
                    >
                      {range === 'All' ? '📅 All Dates' :
                       range === 'Today' ? '📅 Today' :
                       range === 'Week' ? '📅 This Week' : '📅 This Month'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>
            Showing {filteredTransactions.length} of {totalTransactions} transactions
            {selectedType !== 'All' && ` • Type: ${selectedType}`}
            {selectedStatus !== 'All' && ` • Status: ${selectedStatus}`}
            {dateRange !== 'All' && ` • Date: ${dateRange}`}
          </div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            Total value: <strong style={{ color: colors.text }}>₹{
              filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
            }</strong>
          </div>
        </div>
      </div>

      {/* Transactions Display */}
      {filteredTransactions.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
          <h3 style={{ fontSize: '24px', color: colors.text, marginBottom: '12px' }}>
            No transactions found
          </h3>
          <p style={{ marginBottom: '24px' }}>Try adjusting your search or filters</p>
          <button 
            onClick={resetFilters}
            style={styles.button}
          >
            🔄 Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div style={{ ...styles.card, padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Transaction</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Book</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>
                        {transaction.transactionId}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        by {transaction.processedBy}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{transaction.memberName}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        {transaction.memberId}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{transaction.bookTitle}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        ID: {transaction.bookId}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...styles.typeBadge(transaction.type), fontSize: '11px' }}>
                        {getTypeIcon(transaction.type)} {getTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{transaction.date}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        Due: {transaction.dueDate}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: '15px',
                        color: transaction.amount > 0 ? colors.secondary : colors.textSecondary
                      }}>
                        {transaction.amount > 0 ? `₹${transaction.amount}` : 'No charge'}
                      </div>
                      {transaction.fineAmount > 0 && (
                        <div style={{ fontSize: '11px', color: colors.warning }}>
                          Fine: ₹{transaction.fineAmount}
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...styles.statusBadge(transaction.status), fontSize: '11px' }}>
                        {transaction.status === 'active' ? '🟢 Active' :
                         transaction.status === 'completed' ? '✅ Completed' :
                         transaction.status === 'pending' ? '🟡 Pending' : '🔴 Cancelled'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                        }}>
                          👁️ View
                        </button>
                        <button style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderColor: transaction.type === 'fine' && transaction.status === 'pending' ? colors.secondary : colors.primary,
                          color: transaction.type === 'fine' && transaction.status === 'pending' ? colors.secondary : colors.primary,
                        }}>
                          {transaction.type === 'fine' && transaction.status === 'pending' ? '💰 Pay' : '✏️ Edit'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div style={styles.cardContainer}>
          {filteredTransactions.map(transaction => {
            const typeColor = 
              transaction.type === 'borrow' ? colors.borrow :
              transaction.type === 'return' ? colors.return :
              transaction.type === 'renew' ? colors.renew : colors.fine;
            
            return (
              <div key={transaction.id} style={styles.transactionCard}>
                <div style={styles.transactionHeader}>
                  <div>
                    <h3 style={styles.transactionId}>{transaction.transactionId}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <span style={{ ...styles.badge, ...styles.typeBadge(transaction.type), fontSize: '11px' }}>
                        {getTypeIcon(transaction.type)} {getTypeLabel(transaction.type)}
                      </span>
                      <span style={{ ...styles.badge, ...styles.statusBadge(transaction.status), fontSize: '11px' }}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '24px',
                    color: typeColor,
                    opacity: 0.8
                  }}>
                    {getTypeIcon(transaction.type)}
                  </div>
                </div>

                {/* Transaction Details */}
                <div style={styles.transactionDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>👤 Member</span>
                    <span style={styles.detailValue}>
                      {transaction.memberName} ({transaction.memberId})
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>📚 Book</span>
                    <span style={styles.detailValue}>{transaction.bookTitle}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>📅 Date & Time</span>
                    <span style={styles.detailValue}>{transaction.date}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>⏰ Due Date</span>
                    <span style={{
                      ...styles.detailValue,
                      color: new Date(transaction.dueDate) < new Date() ? colors.danger : colors.text
                    }}>
                      {transaction.dueDate}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>👨‍💼 Processed By</span>
                    <span style={styles.detailValue}>{transaction.processedBy}</span>
                  </div>
                </div>

                {/* Amount Box */}
                <div style={{
                  ...styles.amountBox,
                  background: `linear-gradient(135deg, ${typeColor}20, transparent)`,
                  border: `2px solid ${typeColor}40`,
                }}>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
                    {transaction.type === 'fine' ? 'Fine Amount' : 'Transaction Amount'}
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: transaction.amount > 0 ? typeColor : colors.textSecondary
                  }}>
                    {transaction.amount > 0 ? `₹${transaction.amount}` : 'No Charge'}
                  </div>
                  {transaction.fineAmount > 0 && (
                    <div style={{ fontSize: '12px', color: colors.warning, marginTop: '4px' }}>
                      Includes ₹{transaction.fineAmount} fine
                    </div>
                  )}
                </div>

                {/* Notes */}
                {transaction.notes && (
                  <div style={{ 
                    padding: '12px',
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: colors.textSecondary,
                    marginBottom: '20px',
                  }}>
                    📝 {transaction.notes}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                  <button style={styles.smallButton}>
                    👁️ View Details
                  </button>
                  <button style={{
                    ...styles.smallButton,
                    borderColor: typeColor,
                    color: typeColor,
                  }}>
                    📄 Receipt
                  </button>
                  <button style={{
                    ...styles.smallButton,
                    borderColor: colors.secondary,
                    color: colors.secondary,
                  }}>
                    💬 Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: `2px solid ${colors.border}`,
        color: colors.textSecondary,
        fontSize: '14px',
        textAlign: 'center',
        opacity: 0.8,
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          📋 Transaction Management System • Last updated: Today at {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')} AM
        </p>
        <p style={{ margin: 0 }}>
          Need help? Generate a custom report using the <Link href="/reports" style={{ 
            color: colors.primary, 
            textDecoration: 'none',
            fontWeight: 500,
          }}>Reports Tool</Link>
        </p>
      </div>
    </div>
  );
}
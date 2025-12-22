// app/members/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlan, setSelectedPlan] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
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
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    overlay: '#00000040',
    success: '#10b981',
    active: '#22c55e',
    inactive: '#ef4444',
  } : {
    primary: '#2563eb',
    secondary: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    purple: '#7c3aed',
    pink: '#db2777',
    teal: '#0d9488',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    overlay: '#00000020',
    success: '#059669',
    active: '#16a34a',
    inactive: '#dc2626',
  };

  // Mock member data
  const mockMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      membershipId: 'MEM2024001',
      joinDate: '2024-01-15',
      status: 'Active',
      membershipPlan: 'Premium',
      borrowedBooks: 2,
      maxBooks: 5,
      totalBorrowed: 15,
      fineDue: 0,
      lastActivity: 'Today',
      avatarColor: '#3b82f6',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      membershipId: 'MEM2024002',
      joinDate: '2024-01-10',
      status: 'Active',
      membershipPlan: 'Standard',
      borrowedBooks: 1,
      maxBooks: 3,
      totalBorrowed: 8,
      fineDue: 50,
      lastActivity: '2 days ago',
      avatarColor: '#ec4899',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+91 9876543212',
      membershipId: 'MEM2024003',
      joinDate: '2024-01-05',
      status: 'Inactive',
      membershipPlan: 'Basic',
      borrowedBooks: 0,
      maxBooks: 2,
      totalBorrowed: 5,
      fineDue: 0,
      lastActivity: '2 weeks ago',
      avatarColor: '#10b981',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '+91 9876543213',
      membershipId: 'MEM2024004',
      joinDate: '2024-01-20',
      status: 'Active',
      membershipPlan: 'Premium',
      borrowedBooks: 3,
      maxBooks: 5,
      totalBorrowed: 12,
      fineDue: 100,
      lastActivity: 'Today',
      avatarColor: '#f59e0b',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      phone: '+91 9876543214',
      membershipId: 'MEM2024005',
      joinDate: '2023-12-15',
      status: 'Active',
      membershipPlan: 'Standard',
      borrowedBooks: 4,
      maxBooks: 5,
      totalBorrowed: 25,
      fineDue: 0,
      lastActivity: 'Yesterday',
      avatarColor: '#8b5cf6',
    },
    {
      id: 6,
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+91 9876543215',
      membershipId: 'MEM2024006',
      joinDate: '2024-01-18',
      status: 'Suspended',
      membershipPlan: 'Basic',
      borrowedBooks: 0,
      maxBooks: 2,
      totalBorrowed: 3,
      fineDue: 150,
      lastActivity: '1 week ago',
      avatarColor: '#ef4444',
    },
    {
      id: 7,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+91 9876543216',
      membershipId: 'MEM2024007',
      joinDate: '2024-01-12',
      status: 'Active',
      membershipPlan: 'Premium',
      borrowedBooks: 2,
      maxBooks: 5,
      totalBorrowed: 18,
      fineDue: 25,
      lastActivity: 'Today',
      avatarColor: '#14b8a6',
    },
    {
      id: 8,
      name: 'Frank Harris',
      email: 'frank.harris@example.com',
      phone: '+91 9876543217',
      membershipId: 'MEM2024008',
      joinDate: '2024-01-08',
      status: 'Active',
      membershipPlan: 'Standard',
      borrowedBooks: 1,
      maxBooks: 3,
      totalBorrowed: 7,
      fineDue: 0,
      lastActivity: '3 days ago',
      avatarColor: '#6366f1',
    },
  ];

  // Filter members
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);
    
    const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;
    const matchesPlan = selectedPlan === 'All' || member.membershipPlan === selectedPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get unique statuses and plans
  const statuses = ['All', ...new Set(mockMembers.map(member => member.status))];
  const plans = ['All', ...new Set(mockMembers.map(member => member.membershipPlan))];

  // Calculate stats
  const totalMembers = mockMembers.length;
  const activeMembers = mockMembers.filter(m => m.status === 'Active').length;
  const totalBorrowed = mockMembers.reduce((sum, member) => sum + member.totalBorrowed, 0);
  const totalFines = mockMembers.reduce((sum, member) => sum + member.fineDue, 0);

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
    dangerButton: {
      background: `linear-gradient(135deg, ${colors.danger}, #b91c1c)`,
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
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
    },
    memberCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s',
    },
    memberHeader: {
      padding: '24px',
      position: 'relative',
    },
    memberAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
    },
    memberInfo: {
      padding: '0 24px 24px 24px',
    },
    memberName: {
      fontSize: '20px',
      fontWeight: 600,
      color: colors.text,
      margin: '0 0 4px 0',
    },
    memberId: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: '0 0 16px 0',
    },
    memberDetails: {
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
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    activeBadge: {
      background: `linear-gradient(135deg, ${colors.active}, #16a34a)`,
      color: 'white',
    },
    inactiveBadge: {
      background: `linear-gradient(135deg, ${colors.inactive}, #b91c1c)`,
      color: 'white',
    },
    suspendedBadge: {
      background: `linear-gradient(135deg, ${colors.warning}, #b45309)`,
      color: 'white',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: colors.border,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    progressFill: (percentage: number, color: string) => ({
      width: `${percentage}%`,
      height: '100%',
      background: `linear-gradient(90deg, ${color}, ${color}dd)`,
      borderRadius: '4px',
    }),
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '20px',
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
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.textSecondary,
    },
    bulkActions: {
      backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      border: `2px solid ${colors.primary}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '16px',
    },
  };

  // Toggle member selection
  const toggleMemberSelection = (id: number) => {
    setSelectedMembers(prev => 
      prev.includes(id) 
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    );
  };

  // Select all on current page
  const selectAll = () => {
    const pageMemberIds = filteredMembers.map(member => member.id);
    if (selectedMembers.length === pageMemberIds.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(pageMemberIds);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedMembers.length === 0) {
      alert('Please select members first');
      return;
    }
    
    switch(action) {
      case 'export':
        alert(`Exporting ${selectedMembers.length} members...`);
        break;
      case 'message':
        alert(`Sending message to ${selectedMembers.length} members...`);
        break;
      case 'activate':
        alert(`Activating ${selectedMembers.length} members...`);
        break;
      case 'deactivate':
        alert(`Deactivating ${selectedMembers.length} members...`);
        break;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPlan('All');
    setSelectedMembers([]);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active': return styles.activeBadge;
      case 'Inactive': return styles.inactiveBadge;
      case 'Suspended': return styles.suspendedBadge;
      default: return {};
    }
  };

  // Get membership plan color
  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Premium': return colors.purple;
      case 'Standard': return colors.primary;
      case 'Basic': return colors.teal;
      default: return colors.textSecondary;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Member Management</h1>
          <p style={styles.subtitle}>
            Manage library members, track activity, and handle memberships
            <span style={{ 
              marginLeft: '12px', 
              fontSize: '14px', 
              padding: '4px 12px', 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.purple}20)`,
              borderRadius: '20px',
              border: `1px solid ${colors.primary}40`
            }}>
              {totalMembers} total members
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
          <Link 
            href="/members/add"
            style={styles.button}
          >
            👤 Add New Member
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📊 Total Members</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {totalMembers}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>↑ {Math.round((activeMembers / totalMembers) * 100)}% active</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>✅ Active Members</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.active}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {activeMembers}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>{Math.round((activeMembers / totalMembers) * 100)}% of total</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📚 Total Books Borrowed</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.teal}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {totalBorrowed}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>Avg: {Math.round(totalBorrowed / totalMembers)} per member</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>💰 Total Fines Due</p>
          <p style={{ 
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.warning}, ${colors.danger})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ₹{totalFines}
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>From {mockMembers.filter(m => m.fineDue > 0).length} members</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div style={styles.bulkActions}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}>
              {selectedMembers.length}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: colors.text }}>
                {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
              </div>
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                Choose an action to perform on selected members
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleBulkAction('export')}
              style={styles.secondaryButton}
            >
              📥 Export Selected
            </button>
            <button 
              onClick={() => handleBulkAction('message')}
              style={styles.button}
            >
              💬 Send Message
            </button>
            <button 
              onClick={() => handleBulkAction('activate')}
              style={{
                ...styles.button,
                background: `linear-gradient(135deg, ${colors.active}, ${colors.secondary})`,
              }}
            >
              ✅ Activate
            </button>
            <button 
              onClick={() => handleBulkAction('deactivate')}
              style={styles.dangerButton}
            >
              ⚠️ Deactivate
            </button>
            <button 
              onClick={() => setSelectedMembers([])}
              style={styles.outlineButton}
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={styles.sectionTitle}>
            🔍 Search & Filter Members
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
            placeholder="Search by name, email, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button 
            onClick={resetFilters}
            style={styles.outlineButton}
          >
            🔄 Reset Filters
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{
                ...styles.filterButton,
                ...(viewMode === 'grid' ? styles.activeFilter : {})
              }}
            >
              📱 Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{
                ...styles.filterButton,
                ...(viewMode === 'list' ? styles.activeFilter : {})
              }}
            >
              📋 List
            </button>
          </div>
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
                        ...(selectedStatus === status ? styles.activeFilter : {})
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Filter */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                  Membership Plan
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {plans.map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        ...styles.filterButton,
                        ...(selectedPlan === plan ? {
                          background: `linear-gradient(135deg, ${getPlanColor(plan)}, ${getPlanColor(plan)}dd)`,
                          color: 'white',
                          borderColor: getPlanColor(plan),
                        } : {})
                      }}
                    >
                      {plan}
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
            Showing {filteredMembers.length} of {totalMembers} members
            {selectedStatus !== 'All' && ` • Filtered by: ${selectedStatus}`}
            {selectedPlan !== 'All' && ` • Plan: ${selectedPlan}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
              onChange={selectAll}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontSize: '13px', color: colors.textSecondary }}>
              Select all {filteredMembers.length} members
            </span>
          </div>
        </div>
      </div>

      {/* Members Display */}
      {filteredMembers.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>👤</div>
          <h3 style={{ fontSize: '24px', color: colors.text, marginBottom: '12px' }}>
            No members found
          </h3>
          <p style={{ marginBottom: '24px' }}>Try adjusting your search or filters</p>
          <button 
            onClick={resetFilters}
            style={styles.button}
          >
            🔄 Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div style={styles.gridContainer}>
          {filteredMembers.map(member => {
            const borrowedPercentage = (member.borrowedBooks / member.maxBooks) * 100;
            
            return (
              <div key={member.id} style={styles.memberCard}>
                {/* Member Header */}
                <div style={styles.memberHeader}>
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMemberSelection(member.id)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      transform: 'scale(1.3)',
                    }}
                  />
                  
                  {/* Avatar */}
                  <div style={{ ...styles.memberAvatar, background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}dd)` }}>
                    {member.name.charAt(0)}
                  </div>
                  
                  {/* Name and ID */}
                  <h3 style={styles.memberName}>{member.name}</h3>
                  <p style={styles.memberId}>ID: {member.membershipId}</p>
                  
                  {/* Status Badge */}
                  <span style={{ ...styles.badge, ...getStatusBadge(member.status) }}>
                    {member.status}
                  </span>
                </div>

                {/* Member Info */}
                <div style={styles.memberInfo}>
                  {/* Details Grid */}
                  <div style={styles.memberDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📧 Email</span>
                      <span style={styles.detailValue}>{member.email}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📞 Phone</span>
                      <span style={styles.detailValue}>{member.phone}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 Joined</span>
                      <span style={styles.detailValue}>{member.joinDate}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📚 Plan</span>
                      <span style={{ ...styles.detailValue, color: getPlanColor(member.membershipPlan) }}>
                        {member.membershipPlan}
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🕒 Last Active</span>
                      <span style={styles.detailValue}>{member.lastActivity}</span>
                    </div>
                  </div>

                  {/* Borrowing Progress */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📖 Books Borrowed</span>
                      <span style={styles.detailValue}>
                        {member.borrowedBooks}/{member.maxBooks}
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(
                        borrowedPercentage,
                        borrowedPercentage > 80 ? colors.danger : 
                        borrowedPercentage > 50 ? colors.warning : colors.secondary
                      )} />
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Total: {member.totalBorrowed}</span>
                      <span style={styles.detailValue}>
                        {member.fineDue > 0 ? `💰 ₹${member.fineDue}` : '✅ No fines'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <button style={styles.smallButton}>
                      👁️ View
                    </button>
                    <button style={{
                      ...styles.smallButton,
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}>
                      ✏️ Edit
                    </button>
                    <button style={{
                      ...styles.smallButton,
                      borderColor: member.status === 'Active' ? colors.danger : colors.secondary,
                      color: member.status === 'Active' ? colors.danger : colors.secondary,
                    }}>
                      {member.status === 'Active' ? '⏸️ Deactivate' : '▶️ Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ ...styles.card, padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={selectAll}
                      style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    Member
                  </th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Borrowed</th>
                  <th style={styles.th}>Fines</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id} style={{
                    backgroundColor: selectedMembers.includes(member.id) 
                      ? (darkMode ? '#1e3a8a20' : '#dbeafe') 
                      : 'transparent',
                  }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleMemberSelection(member.id)}
                          style={{ transform: 'scale(1.1)' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px' }}>{member.name}</div>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                              {member.membershipId}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '13px' }}>{member.email}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        {member.phone}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getStatusBadge(member.status), fontSize: '11px' }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        backgroundColor: `${getPlanColor(member.membershipPlan)}20`,
                        color: getPlanColor(member.membershipPlan),
                        border: `1px solid ${getPlanColor(member.membershipPlan)}40`,
                      }}>
                        {member.membershipPlan}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                          {member.borrowedBooks}/{member.maxBooks}
                        </div>
                        <div style={styles.progressBar}>
                          <div style={styles.progressFill(
                            (member.borrowedBooks / member.maxBooks) * 100,
                            colors.secondary
                          )} />
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {member.fineDue > 0 ? (
                        <span style={{ 
                          color: colors.danger, 
                          fontWeight: 600,
                          fontSize: '13px'
                        }}>
                          ₹{member.fineDue}
                        </span>
                      ) : (
                        <span style={{ 
                          color: colors.textSecondary,
                          fontSize: '12px'
                        }}>
                          No fines
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                        }}>
                          👁️
                        </button>
                        <button style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderColor: colors.primary,
                          color: colors.primary,
                        }}>
                          ✏️
                        </button>
                        <button style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderColor: colors.secondary,
                          color: colors.secondary,
                        }}>
                          💬
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          👥 Member Management System • {activeMembers} active members • Last updated: Today
        </p>
        <p style={{ margin: 0 }}>
          Need to import members in bulk? Use the <Link href="/import" style={{ 
            color: colors.primary, 
            textDecoration: 'none',
            fontWeight: 500,
          }}>Import Tool</Link>
        </p>
      </div>
    </div>
  );
}
// app/returns/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  const [searchType, setSearchType] = useState<'barcode' | 'transactionId' | 'member'>('barcode');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [finePaid, setFinePaid] = useState(false);
  const [notes, setNotes] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    overlay: '#00000040',
  } : {
    primary: '#2563eb',
    secondary: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    purple: '#7c3aed',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    overlay: '#00000020',
  };

  // Styles with colors
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
      backgroundColor: colors.primary,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.2s',
      boxShadow: `0 4px 6px ${colors.overlay}`,
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: `0 4px 6px ${colors.overlay}`,
    },
    dangerButton: {
      backgroundColor: colors.danger,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: `0 4px 6px ${colors.overlay}`,
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
    },
    searchContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap' as const,
    },
    searchTypeButton: {
      padding: '10px 20px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      backgroundColor: colors.cardBg,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: colors.textSecondary,
    },
    activeSearchType: {
      backgroundColor: colors.primary,
      color: 'white',
      borderColor: colors.primary,
      transform: 'translateY(-2px)',
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
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0',
    },
    transactionCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      border: `2px solid ${colors.border}`,
      transition: 'all 0.3s',
    },
    overdueCard: {
      background: `linear-gradient(135deg, ${colors.cardBg}, #1a0000)`,
      borderColor: colors.danger,
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      color: colors.text,
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: colors.cardBg,
      color: colors.text,
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      fontSize: '14px',
      minHeight: '100px',
      fontFamily: 'inherit',
      backgroundColor: colors.cardBg,
      color: colors.text,
    },
    checkbox: {
      marginRight: '10px',
      transform: 'scale(1.2)',
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    overdueBadge: {
      background: `linear-gradient(135deg, ${colors.danger}, #b91c1c)`,
      color: 'white',
    },
    activeBadge: {
      background: `linear-gradient(135deg, ${colors.secondary}, #047857)`,
      color: 'white',
    },
    fineBadge: {
      background: `linear-gradient(135deg, ${colors.warning}, #b45309)`,
      color: 'white',
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
    actionButton: {
      padding: '8px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      backgroundColor: colors.cardBg,
      fontSize: '12px',
      cursor: 'pointer',
      marginRight: '8px',
      transition: 'all 0.2s',
      color: colors.text,
    },
    primaryAction: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
      color: 'white',
      borderColor: colors.primary,
    },
    alertBox: {
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      border: `2px solid`,
    },
    warningAlert: {
      background: `linear-gradient(135deg, #fef3c7, #fde68a)`,
      borderColor: '#f59e0b',
      color: '#92400e',
    },
    infoAlert: {
      background: `linear-gradient(135deg, #dbeafe, #bfdbfe)`,
      borderColor: colors.primary,
      color: '#1e40af',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.textSecondary,
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
  };

  // Mock data (same as before)
  const activeBorrows = [
    {
      id: 1,
      transactionId: 'TXN001',
      memberId: 'MEM2024001',
      memberName: 'John Doe',
      bookTitle: 'The Great Gatsby',
      bookAuthor: 'F. Scott Fitzgerald',
      bookISBN: '9780743273565',
      borrowDate: '2024-01-15',
      dueDate: '2024-01-29',
      daysOverdue: 5,
      fineAmount: 50,
      status: 'overdue'
    },
    {
      id: 2,
      transactionId: 'TXN002',
      memberId: 'MEM2024002',
      memberName: 'Jane Smith',
      bookTitle: '1984',
      bookAuthor: 'George Orwell',
      bookISBN: '9780451524935',
      borrowDate: '2024-01-20',
      dueDate: '2024-02-03',
      daysOverdue: 0,
      fineAmount: 0,
      status: 'active'
    },
    {
      id: 3,
      transactionId: 'TXN003',
      memberId: 'MEM2024003',
      memberName: 'Bob Johnson',
      bookTitle: 'Python Crash Course',
      bookAuthor: 'Eric Matthes',
      bookISBN: '9781593279288',
      borrowDate: '2024-01-18',
      dueDate: '2024-02-01',
      daysOverdue: 0,
      fineAmount: 0,
      status: 'active'
    },
    {
      id: 4,
      transactionId: 'TXN004',
      memberId: 'MEM2024004',
      memberName: 'Alice Brown',
      bookTitle: 'Pride and Prejudice',
      bookAuthor: 'Jane Austen',
      bookISBN: '9780141439518',
      borrowDate: '2024-01-10',
      dueDate: '2024-01-24',
      daysOverdue: 10,
      fineAmount: 100,
      status: 'overdue'
    },
    {
      id: 5,
      transactionId: 'TXN005',
      memberId: 'MEM2024005',
      memberName: 'Charlie Wilson',
      bookTitle: 'Clean Code',
      bookAuthor: 'Robert C. Martin',
      bookISBN: '9780132350884',
      borrowDate: '2024-01-22',
      dueDate: '2024-02-05',
      daysOverdue: 0,
      fineAmount: 0,
      status: 'active'
    },
  ];

  const recentReturns = [
    {
      id: 1,
      transactionId: 'TXN006',
      memberName: 'David Miller',
      bookTitle: 'To Kill a Mockingbird',
      returnDate: '2024-01-29 10:30',
      finePaid: 25,
      returnedBy: 'John Librarian'
    },
    {
      id: 2,
      transactionId: 'TXN007',
      memberName: 'Emma Wilson',
      bookTitle: 'The Catcher in the Rye',
      returnDate: '2024-01-29 09:15',
      finePaid: 0,
      returnedBy: 'Jane Assistant'
    },
    {
      id: 3,
      transactionId: 'TXN008',
      memberName: 'Frank Harris',
      bookTitle: 'The Design of Everyday Things',
      returnDate: '2024-01-28 16:45',
      finePaid: 40,
      returnedBy: 'John Librarian'
    },
  ];

  const todaysStats = {
    returnsToday: 12,
    overdueReturns: 3,
    finesCollected: 450,
    activeBorrows: 24,
    averageReturnTime: '14 days'
  };

  // Helper functions (same as before)
  const calculateFine = (daysOverdue: number) => daysOverdue * 10;
  const handleSearch = () => {
    if (!searchValue.trim()) {
      alert('Please enter a search value');
      return;
    }
    const found = activeBorrows.find(t => 
      searchType === 'transactionId' && t.transactionId.includes(searchValue) ||
      searchType === 'member' && (t.memberId.includes(searchValue) || t.memberName.toLowerCase().includes(searchValue.toLowerCase()))
    );
    if (found) {
      setSelectedTransaction(found);
    } else {
      alert('No matching transaction found');
      setSelectedTransaction(null);
    }
  };
  const handleReturn = () => {
    if (!selectedTransaction) {
      alert('Please select a transaction first');
      return;
    }
    const fine = selectedTransaction.daysOverdue > 0 ? calculateFine(selectedTransaction.daysOverdue) : 0;
    if (fine > 0 && !finePaid) {
      alert(`Please pay the fine of ₹${fine} before returning`);
      return;
    }
    const message = `Book "${selectedTransaction.bookTitle}" returned successfully!`;
    if (fine > 0) {
      alert(`${message}\nFine of ₹${fine} collected.`);
    } else {
      alert(message);
    }
    setSelectedTransaction(null);
    setSearchValue('');
    setFinePaid(false);
    setNotes('');
  };
  const handleQuickReturn = (transactionId: string) => {
    const transaction = activeBorrows.find(t => t.transactionId === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      const fine = transaction.daysOverdue > 0 ? calculateFine(transaction.daysOverdue) : 0;
      if (fine > 0) {
        if (confirm(`This book is ${transaction.daysOverdue} days overdue. Fine: ₹${fine}. Process return?`)) {
          alert(`Book "${transaction.bookTitle}" returned with fine collected.`);
        }
      } else {
        alert(`Book "${transaction.bookTitle}" returned successfully!`);
      }
    }
  };
  const handleBulkReturn = () => {
    const selected = activeBorrows.filter(t => t.daysOverdue === 0).slice(0, 3);
    if (selected.length === 0) {
      alert('No eligible books for bulk return');
      return;
    }
    const totalBooks = selected.length;
    alert(`Processing bulk return for ${totalBooks} books...\n\n${selected.map(t => `• ${t.bookTitle}`).join('\n')}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 Book Returns</h1>
          <p style={styles.subtitle}>
            Process returns, calculate fines, and manage overdue books • {activeBorrows.length} active transactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleBulkReturn}
            style={styles.secondaryButton}
          >
            📁 Bulk Return
          </button>
          <Link 
            href="/borrow"
            style={styles.button}
          >
            📖 Go to Borrow
          </Link>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              ...styles.button,
              backgroundColor: colors.warning,
              padding: '12px 20px',
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Overdue Alert */}
      {activeBorrows.filter(t => t.status === 'overdue').length > 0 && (
        <div style={{ ...styles.alertBox, ...styles.warningAlert }}>
          <span style={{ marginRight: '16px', fontSize: '24px' }}>⚠️</span>
          <div>
            <strong style={{ fontSize: '16px' }}>Overdue Alert!</strong> 
            <div style={{ marginTop: '4px' }}>
              There are {activeBorrows.filter(t => t.status === 'overdue').length} books overdue. 
              Total pending fines: <strong>₹{activeBorrows.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.fineAmount, 0)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📦 Returns Today</p>
          <p style={styles.statValue}>{todaysStats.returnsToday}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>⏰ Overdue Returns</p>
          <p style={styles.statValue}>{todaysStats.overdueReturns}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>💰 Fines Collected</p>
          <p style={styles.statValue}>₹{todaysStats.finesCollected}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📅 Avg Return Time</p>
          <p style={styles.statValue}>{todaysStats.averageReturnTime}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Return Form */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '24px' }}>📦</span> Return Book
            </h2>
            
            {/* Search Options */}
            <div style={styles.searchContainer}>
              {[
                { type: 'barcode', icon: '📷', label: 'Scan Barcode' },
                { type: 'transactionId', icon: '📄', label: 'Transaction ID' },
                { type: 'member', icon: '👤', label: 'Member Search' }
              ].map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type as any)}
                  style={{
                    ...styles.searchTypeButton,
                    ...(searchType === type ? styles.activeSearchType : {})
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder={
                  searchType === 'barcode' ? 'Scan book barcode or enter ISBN...' :
                  searchType === 'transactionId' ? 'Enter transaction ID (e.g., TXN001)...' :
                  'Enter member ID or name...'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={styles.searchInput}
              />
              <button 
                onClick={handleSearch}
                style={{
                  ...styles.button,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🔍 Search
              </button>
            </div>

            {/* Selected Transaction */}
            {selectedTransaction ? (
              <div style={{ 
                ...styles.transactionCard, 
                ...(selectedTransaction.status === 'overdue' ? styles.overdueCard : {}) 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600 }}>
                      {selectedTransaction.bookTitle}
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: colors.textSecondary }}>
                      by {selectedTransaction.bookAuthor}
                    </p>
                  </div>
                  <span style={{
                    ...styles.badge,
                    ...(selectedTransaction.status === 'overdue' ? styles.overdueBadge : styles.activeBadge)
                  }}>
                    {selectedTransaction.status === 'overdue' ? '⚠️ Overdue' : '✅ Active'}
                  </span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px', 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '10px'
                }}>
                  <div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 4px 0' }}>Member</p>
                    <p style={{ fontSize: '15px', margin: 0, fontWeight: 500 }}>
                      {selectedTransaction.memberName}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
                      ID: {selectedTransaction.memberId}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 4px 0' }}>Transaction</p>
                    <p style={{ fontSize: '15px', margin: 0, fontWeight: 500 }}>
                      {selectedTransaction.transactionId}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
                      Due: {selectedTransaction.dueDate}
                    </p>
                  </div>
                </div>

                {/* Fine Section */}
                {selectedTransaction.daysOverdue > 0 && (
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.warning}20, ${colors.warning}10)`,
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: `2px solid ${colors.warning}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                          ⏰ {selectedTransaction.daysOverdue} days overdue
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary }}>
                          Fine: ₹{calculateFine(selectedTransaction.daysOverdue)} @ ₹10/day
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id="finePaid"
                          checked={finePaid}
                          onChange={(e) => setFinePaid(e.target.checked)}
                          style={styles.checkbox}
                        />
                        <label htmlFor="finePaid" style={{ fontSize: '14px', color: colors.text }}>
                          Mark fine as paid
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>📝 Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about book condition or return..."
                    style={styles.textarea}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleReturn}
                    style={{
                      ...styles.button,
                      flex: 1,
                      background: selectedTransaction.daysOverdue > 0 
                        ? `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
                        : `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                      fontSize: '15px',
                      padding: '14px',
                    }}
                  >
                    {selectedTransaction.daysOverdue > 0 ? '💰 Pay & Return Book' : '✅ Return Book'}
                  </button>
                  <button 
                    onClick={() => setSelectedTransaction(null)}
                    style={{
                      ...styles.actionButton,
                      padding: '14px 24px',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ ...styles.alertBox, ...styles.infoAlert }}>
                <span style={{ marginRight: '16px', fontSize: '28px' }}>💡</span>
                <div>
                  <strong style={{ fontSize: '16px' }}>Quick Return Instructions</strong>
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    Scan book barcode, search by transaction ID, or select from active borrows below.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Borrows Table */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={styles.sectionTitle}>
                <span style={{ fontSize: '24px' }}>📋</span> Active Borrows ({activeBorrows.length})
              </h2>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                Updated just now
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Member</th>
                    <th style={styles.th}>Book</th>
                    <th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Fine</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBorrows.map(transaction => (
                    <tr key={transaction.id} style={{
                      backgroundColor: transaction.status === 'overdue' 
                        ? (darkMode ? '#2c1a1a' : '#fef2f2') 
                        : 'transparent',
                      transition: 'background-color 0.2s',
                    }}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600, color: colors.text }}>{transaction.memberName}</div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {transaction.memberId}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600, color: colors.text }}>{transaction.bookTitle}</div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {transaction.bookAuthor}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500 }}>{transaction.dueDate}</div>
                        {transaction.daysOverdue > 0 && (
                          <div style={{ fontSize: '12px', color: colors.danger, marginTop: '4px' }}>
                            ⚠️ {transaction.daysOverdue} days overdue
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          ...(transaction.status === 'overdue' ? styles.overdueBadge : styles.activeBadge),
                          fontSize: '11px',
                        }}>
                          {transaction.status === 'overdue' ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {transaction.fineAmount > 0 ? (
                          <span style={{ ...styles.badge, ...styles.fineBadge, fontSize: '11px' }}>
                            ₹{transaction.fineAmount}
                          </span>
                        ) : (
                          <span style={{ color: colors.textSecondary, fontSize: '12px' }}>No fine</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <button 
                          onClick={() => handleQuickReturn(transaction.transactionId)}
                          style={{ 
                            ...styles.actionButton, 
                            ...styles.primaryAction,
                            padding: '8px 16px',
                            fontSize: '12px',
                          }}
                        >
                          Return Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeBorrows.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                <h3 style={{ fontSize: '20px', color: colors.text, marginBottom: '8px' }}>
                  No active borrows
                </h3>
                <p>All books have been returned!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Today's Summary */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '24px' }}>📊</span> Today's Summary
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                { label: 'Books Returned', value: todaysStats.returnsToday, color: colors.primary, percent: 75 },
                { label: 'Fines Collected', value: `₹${todaysStats.finesCollected}`, color: colors.secondary, percent: 60 },
                { label: 'Overdue Returns', value: todaysStats.overdueReturns, color: colors.danger, percent: 25 },
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: colors.textSecondary }}>{stat.label}</span>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>{stat.value}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={styles.progressFill(stat.percent, stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Returns */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={styles.sectionTitle}>
                <span style={{ fontSize: '24px' }}>🕒</span> Recent Returns
              </h2>
              <Link href="/transactions" style={{ 
                fontSize: '14px', 
                color: colors.primary, 
                textDecoration: 'none',
                fontWeight: 500,
              }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentReturns.map(returnItem => (
                <div key={returnItem.id} style={{
                  padding: '16px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  backgroundColor: returnItem.finePaid > 0 
                    ? (darkMode ? '#1a2a3a' : '#f0f9ff') 
                    : colors.cardBg,
                  transition: 'transform 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{returnItem.bookTitle}</div>
                    {returnItem.finePaid > 0 && (
                      <span style={{ ...styles.badge, ...styles.fineBadge, fontSize: '11px' }}>
                        ₹{returnItem.finePaid} paid
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '4px' }}>
                    Returned by {returnItem.memberName} • {returnItem.returnDate}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, opacity: 0.8 }}>
                    Processed by: {returnItem.returnedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '24px' }}>⚡</span> Quick Actions
            </h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {[
                { icon: '📁', label: 'Bulk Return (3+ books)', color: colors.purple, action: handleBulkReturn },
                { icon: '🖨️', label: "Print Today's Receipts", color: colors.warning, action: () => alert('Printing...') },
                { icon: '📧', label: 'Send Overdue Reminders', color: colors.danger, action: () => alert('Sending...') },
                { icon: '📊', label: 'Generate Return Report', color: colors.secondary, action: () => alert('Generating...') },
              ].map((action, index) => (
                <button 
                  key={index}
                  onClick={action.action}
                  style={{
                    ...styles.button,
                    background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                    textAlign: 'left' as const,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fine Calculator */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '24px' }}>💰</span> Fine Calculator
            </h2>
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.warning}20, ${colors.warning}10)`,
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center' as const,
              border: `2px solid ${colors.warning}`
            }}>
              <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '8px' }}>Fine for 5 days overdue</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: colors.text, marginBottom: '4px' }}>
                ₹50.00
              </div>
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                @ ₹10 per day after due date
              </div>
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: colors.textSecondary, 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: darkMode ? '#374151' : '#f9fafb',
              borderRadius: '8px',
              fontStyle: 'italic'
            }}>
              Note: Fines are calculated daily. No fines on Sundays or holidays.
            </div>
          </div>
        </div>
      </div>

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
          📊 Return Management System • Last updated: Today at {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')} AM
        </p>
        <p style={{ margin: 0 }}>
          Need help? Contact library admin at <strong style={{ color: colors.primary }}>admin@library.com</strong> or call +91 9876543210
        </p>
      </div>
    </div>
  );
}
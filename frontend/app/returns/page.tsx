// app/returns/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { transactionAPI } from '@/lib/api';

export default function ReturnsPage() {
  const [searchType, setSearchType] = useState<'barcode' | 'transactionId' | 'member'>('barcode');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [finePaid, setFinePaid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Real Data State
  const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
  const [todaysStats, setTodaysStats] = useState({
    returnsToday: 0,
    overdueReturns: 0,
    finesCollected: 0,
    activeBorrows: 0,
    averageReturnTime: '0 days'
  });
  const [loading, setLoading] = useState(true);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all history to calculate stats and get active borrows
      const data = await transactionAPI.getHistory(undefined, 1, 1000); // Fetch reasonable large number for "active" list
      const allTransactions = data.transactions || [];

      // Filter Active Borrows
      const active = allTransactions.filter((t: any) => t.status === 'borrowed' || t.status === 'overdue');

      const mappedActive = active.map((t: any) => {
        const dueDate = new Date(t.due_date);
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        const daysOverdue = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

        return {
          id: t._id,
          transactionId: t._id.substring(0, 8).toUpperCase(), // Mocking a short ID from Mongo ID
          fullTransactionId: t._id,
          memberId: t.member_id?.substring(0, 8).toUpperCase() || 'UNKNOWN',
          memberName: t.member_name || 'Unknown',
          bookTitle: t.book_title || 'Unknown',
          bookAuthor: 'Unknown', // API doesn't return author in transaction list yet, or we'd need to fetch book details. Keeping simple.
          bookISBN: 'N/A',
          borrowDate: new Date(t.borrow_date).toLocaleDateString(),
          dueDate: new Date(t.due_date).toLocaleDateString(),
          daysOverdue: daysOverdue,
          fineAmount: daysOverdue * 10, // Mock fine rule
          status: daysOverdue > 0 ? 'overdue' : 'active'
        };
      });

      setActiveBorrows(mappedActive);

      // Calculate Today's Stats
      const today = new Date().toDateString();
      const returnsToday = allTransactions.filter((t: any) => t.return_date && new Date(t.return_date).toDateString() === today);
      const overdueReturnsToday = returnsToday.filter((t: any) => {
        // simplified overdue check for returned items based on history logic if available, 
        // or just placeholder since we might not have 'was overdue' flag easily without more calculation
        return false;
      }).length;

      setTodaysStats({
        returnsToday: returnsToday.length,
        overdueReturns: overdueReturnsToday,
        finesCollected: 0, // Placeholder till fines API integrated
        activeBorrows: active.length,
        averageReturnTime: 'N/A'
      });

    } catch (error) {
      console.error("Failed to fetch returns data:", error);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const calculateFine = (daysOverdue: number) => daysOverdue * 10;

  const handleSearch = () => {
    if (!searchValue.trim()) {
      alert('Please enter a search value');
      return;
    }
    const found = activeBorrows.find(t =>
      searchType === 'transactionId' && t.transactionId.includes(searchValue) ||
      searchType === 'member' && (t.memberId.includes(searchValue) || t.memberName.toLowerCase().includes(searchValue.toLowerCase())) ||
      searchType === 'barcode' && (t.bookTitle.toLowerCase().includes(searchValue.toLowerCase())) // Placeholder for barcode/ISBN search by title for now
    );
    if (found) {
      setSelectedTransaction(found);
    } else {
      alert('No matching transaction found');
      setSelectedTransaction(null);
    }
  };

  const handleReturn = async () => {
    if (!selectedTransaction) {
      alert('Please select a transaction first');
      return;
    }

    const fine = selectedTransaction.daysOverdue > 0 ? calculateFine(selectedTransaction.daysOverdue) : 0;

    // Simple fine check prompt (In real app, we'd integrate with Fine API)
    if (fine > 0 && !finePaid) {
      if (!confirm(`This book has a fine of ₹${fine}. Has the member paid this amount?`)) {
        return;
      }
    }

    try {
      await transactionAPI.returnBook(selectedTransaction.fullTransactionId);

      const message = `Book "${selectedTransaction.bookTitle}" returned successfully!`;
      alert(message);

      setSelectedTransaction(null);
      setSearchValue('');
      setFinePaid(false);

      // Refresh Data
      fetchData();

    } catch (error: any) {
      alert(`Failed to return book: ${error.message || 'Unknown error'}`);
    }
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
          <p style={styles.statValue}>{loading ? '...' : todaysStats.returnsToday}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>⏰ Overdue Returns</p>
          <p style={styles.statValue}>{loading ? '...' : todaysStats.overdueReturns}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>💰 Fines Collected</p>
          <p style={styles.statValue}>₹{loading ? '...' : todaysStats.finesCollected}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📅 Avg Return Time</p>
          <p style={styles.statValue}>{loading ? '...' : todaysStats.averageReturnTime}</p>
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
                Real-time
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
                  {activeBorrows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: colors.textSecondary }}>
                        No active borrows.
                      </td>
                    </tr>
                  ) : (
                    activeBorrows.map((transaction) => (
                      <tr key={transaction.id}>
                        <td style={styles.td}>
                          <div><strong>{transaction.memberName}</strong></div>
                          <div style={{ fontSize: '12px', color: colors.textSecondary }}>{transaction.memberId}</div>
                        </td>
                        <td style={styles.td}>{transaction.bookTitle}</td>
                        <td style={styles.td}>{transaction.dueDate}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            ...(transaction.status === 'overdue' ? styles.overdueBadge : styles.activeBadge)
                          }}>
                            {transaction.status === 'overdue' ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {transaction.fineAmount > 0 ? (
                            <span style={{ color: colors.danger, fontWeight: 'bold' }}>₹{transaction.fineAmount}</span>
                          ) : '-'}
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            style={styles.actionButton}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
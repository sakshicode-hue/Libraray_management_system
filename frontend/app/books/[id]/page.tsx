"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { bookAPI } from '@/lib/api';
import Link from 'next/link';

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    fetchBookDetails();
  }, [id, router]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const data = await bookAPI.getBook(id);
      setBook(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching book details:', err);
      if (err.message.includes("401") || err.message.includes("Not authenticated")) {
        router.push('/login');
      } else {
        setError("Failed to load book details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book? This cannot be undone.')) {
      try {
        await bookAPI.deleteBook(id);
        alert('Book deleted successfully');
        router.push('/books');
      } catch (err: any) {
        alert(`Failed to delete book: ${err.message}`);
      }
    }
  };

  // Consistent Color Palette
  const colors = darkMode ? {
    primary: '#3b82f6',
    secondary: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
  } : {
    primary: '#2563eb',
    secondary: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  };

  const styles = {
    container: {
      padding: '40px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '20px',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`,
    },
    header: {
      padding: '40px',
      background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
      display: 'flex',
      gap: '40px',
      flexWrap: 'wrap' as const,
    },
    coverPlaceholder: {
      width: '240px',
      height: '360px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '80px',
      color: 'white',
      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3)',
      flexShrink: 0,
    },
    headerContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
    },
    title: {
      fontSize: '42px',
      fontWeight: 800,
      margin: '0 0 16px 0',
      lineHeight: 1.2,
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    author: {
      fontSize: '20px',
      color: colors.textSecondary,
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    badge: {
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      marginRight: '12px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '24px',
      padding: '40px',
      borderBottom: `1px solid ${colors.border}`,
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    statLabel: {
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      color: colors.textSecondary,
      letterSpacing: '1px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.text,
    },
    section: {
      padding: '40px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 700,
      marginBottom: '16px',
      color: colors.text,
    },
    description: {
      lineHeight: 1.8,
      color: colors.textSecondary,
      fontSize: '16px',
    },
    buttonContainer: {
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '16px',
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      borderTop: `1px solid ${colors.border}`,
    },
    button: {
      padding: '12px 24px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.background }}>
        <div style={{ fontSize: '24px', color: colors.primary, fontWeight: 'bold' }}>Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.background, flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', color: colors.danger }}>Error</h2>
        <p style={{ color: colors.textSecondary }}>{error || "Book not found"}</p>
        <button onClick={() => router.push('/books')} style={{ marginTop: '20px', ...styles.button, backgroundColor: colors.primary, color: 'white' }}>
          Back to Books
        </button>
      </div>
    );
  }

  const isAvailable = book.available_copies > 0;

  return (
    <div style={styles.container}>
      <button
        onClick={() => router.push('/books')}
        style={{
          marginBottom: '20px',
          background: 'none',
          border: 'none',
          color: colors.textSecondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '15px'
        }}
      >
        ← Back to Catalog
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.coverPlaceholder}>
            📚
          </div>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>{book.title}</h1>
            <div style={styles.author}>
              <span>By</span>
              <span style={{ color: colors.primary, fontWeight: 600 }}>{book.author}</span>
            </div>
            <div>
              <span style={{
                ...styles.badge,
                backgroundColor: isAvailable ? `${colors.secondary}20` : `${colors.danger}20`,
                color: isAvailable ? colors.secondary : colors.danger
              }}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <span style={{
                ...styles.badge,
                backgroundColor: `${colors.primary}20`,
                color: colors.primary
              }}>
                {book.category}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>ISBN</span>
            <span style={styles.statValue}>{book.isbn}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Publisher</span>
            <span style={styles.statValue}>{book.publisher || 'N/A'}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Year</span>
            <span style={styles.statValue}>{book.publication_year || 'N/A'}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Copies</span>
            <span style={styles.statValue}>{book.available_copies} / {book.total_copies}</span>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.description}>
            {book.description || "No description available for this book."}
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <Link
            href={`/books/edit/${book.id}`}
            style={{ ...styles.button, backgroundColor: colors.primary, color: 'white' }}
          >
            ✏️ Edit Book
          </Link>
          <button
            onClick={handleDelete}
            style={{ ...styles.button, backgroundColor: colors.danger, color: 'white' }}
          >
            🗑️ Delete Book
          </button>
        </div>
      </div>
    </div>
  );
}

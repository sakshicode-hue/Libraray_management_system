// app/ebooks/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ebookAPI } from '@/lib/api';

export default function EBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Real Data State
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await ebookAPI.getEbooks();
      // Handle array vs object response structure if needed, assuming array based on previous patterns or standard list response
      const booksList = Array.isArray(data) ? data : (data.ebooks || []);

      const mappedBooks = booksList.map((b: any) => ({
        id: b.id || b._id,
        title: b.title,
        author: b.author,
        category: b.category || 'General',
        format: b.format || 'PDF', // Default to PDF if not specified
        size: b.file_size ? `${(b.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown', // Convert bytes to MB
        pages: b.num_pages || 'N/A',
        year: b.publication_year,
        downloads: b.download_count || 0,
        rating: b.rating || 0, // Assuming 0 if no rating
        description: b.description || 'No description available.',
        coverColor: getRandomColor(), // Since backend might not have cover color, generate one
        isFeatured: false, // No featured flag in standard API usually
      }));

      setEbooks(mappedBooks);
    } catch (error) {
      console.error("Failed to fetch ebooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
  };

  // Filter e-books
  const filteredEBooks = ebooks.filter(ebook => {
    const matchesSearch =
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || ebook.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...new Set(ebooks.map(ebook => ebook.category))];

  // Calculate stats
  const totalEBooks = ebooks.length;
  const totalDownloads = ebooks.reduce((sum, ebook) => sum + ebook.downloads, 0);

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
      background: `linear-gradient(135deg, ${colors.purple}, ${colors.primary})`,
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
      background: `linear-gradient(135deg, ${colors.purple}, ${colors.primary})`,
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
    },
    outlineButton: {
      padding: '12px 24px',
      border: `2px solid ${colors.purple}`,
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: colors.purple,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
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
      boxShadow: `0 4px 6px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
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
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: colors.cardBg,
      color: colors.text,
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
      background: `linear-gradient(135deg, ${colors.purple}, ${colors.primary})`,
      color: 'white',
      borderColor: colors.purple,
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
    },
    ebookCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 4px 6px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.2s',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
    },
    smallButton: {
      padding: '6px 12px',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      backgroundColor: colors.cardBg,
      color: colors.text,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
  };

  const handleDownload = async (ebook: any) => {
    setDownloading(ebook.id);
    try {
      const blob = await ebookAPI.downloadEbook(ebook.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ebook.title}.pdf`; // Assuming PDF for now, or use ebook.format
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh to update download count if API supports it
      fetchData();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Classic': return colors.purple;
      case 'Fantasy': return colors.warning;
      case 'Dystopian': return colors.danger;
      case 'Romance': return colors.pink;
      case 'Adventure': return colors.teal;
      default: return colors.primary;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📱 E-Books</h1>
          <p style={styles.subtitle}>
            Digital library collection available for instant download
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
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📚 Total E-Books</p>
          <p style={{
            ...styles.statValue,
            color: colors.purple,
          }}>
            {loading ? '...' : totalEBooks}
          </p>
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '4px' }}>
            Available titles
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>⬇️ Total Downloads</p>
          <p style={{
            ...styles.statValue,
            color: colors.primary,
          }}>
            {loading ? '...' : totalDownloads.toLocaleString()}
          </p>
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '4px' }}>
            All-time downloads
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: `0 4px 6px ${colors.overlay}`,
        marginBottom: '24px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.filterButton,
                ...(selectedCategory === category ? {
                  background: `linear-gradient(135deg, ${getCategoryColor(category)}, ${getCategoryColor(category)}dd)`,
                  color: 'white',
                  borderColor: getCategoryColor(category),
                } : {})
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* E-Books Display */}
      {filteredEBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textSecondary }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📱</div>
          <div style={{ fontSize: '24px', color: colors.text, marginBottom: '12px' }}>
            {loading ? 'Loading library...' : 'No e-books found'}
          </div>
          {!loading && <div>Try adjusting your search or filters</div>}
        </div>
      ) : (
        /* Grid View */
        <div style={styles.gridContainer}>
          {filteredEBooks.map(ebook => (
            <div key={ebook.id} style={styles.ebookCard}>
              {/* Header */}
              <div style={{
                padding: '24px',
                background: `linear-gradient(135deg, ${ebook.coverColor}, ${ebook.coverColor}dd)`,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '80px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ebook.coverColor,
                    fontWeight: 'bold',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                    📖
                  </div>
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '4px',
                    }}>
                      {ebook.title}
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                      {ebook.author}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                {/* Description */}
                <div style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  marginBottom: '20px',
                  lineHeight: '1.5',
                  height: '60px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {ebook.description}
                </div>

                {/* Details */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.textSecondary }}>Category</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: getCategoryColor(ebook.category),
                    }}>
                      {ebook.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.textSecondary }}>Format</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.success,
                    }}>
                      {ebook.format}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.textSecondary }}>Size</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{ebook.size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.textSecondary }}>Downloads</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{ebook.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDownload(ebook)}
                    disabled={downloading === ebook.id}
                    style={{
                      ...styles.smallButton,
                      flex: 1,
                      background: `linear-gradient(135deg, ${colors.success}, ${colors.secondary})`,
                      color: 'white',
                      border: 'none',
                      justifyContent: 'center',
                      opacity: downloading === ebook.id ? 0.7 : 1,
                    }}
                  >
                    {downloading === ebook.id ? '⏳ Downloading...' : '⬇️ Download'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
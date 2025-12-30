"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookAPI } from '@/lib/api';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('title');

  const router = useRouter();

  // Check for dark mode preference
  useEffect(() => {
    // Check for authentication token
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    fetchBooks();
  }, [router]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookAPI.getBooks();

      // Map API data to UI format
      const mappedBooks = data.books.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.category.toLowerCase(),
        year: book.publication_year || 'N/A',
        publisher: book.publisher || 'N/A',
        totalCopies: book.total_copies,
        availableCopies: book.available_copies,
        status: (book.available_copies > 0) ? 'available' : 'unavailable',
        rating: 4.5, // Placeholder as backend doesn't track ratings yet
        borrowCount: book.borrow_count || 0, // Ensure this field exists or default to 0
        description: book.description || 'No description available.',
        language: 'English', // Default
        pages: 300, // Default/Placeholder
        location: 'Section A', // Default/Placeholder
        coverColor: `hsl(${Math.abs(book.title.length * 40) % 360}, 70%, 60%)`, // Deterministic color
      }));

      setBooks(mappedBooks);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      if (err.message.includes("401") || err.message.includes("Not authenticated")) {
        router.push('/login');
      } else {
        setError(err.message);
      }
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
    pink: '#ec4899',
    teal: '#14b8a6',
    orange: '#f97316',
    indigo: '#6366f1',
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    overlay: '#00000040',
    fiction: '#3b82f6',
    programming: '#10b981',
    science: '#8b5cf6',
    history: '#f59e0b',
    romance: '#ec4899',
    fantasy: '#f97316',
  } : {
    primary: '#2563eb',
    secondary: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    purple: '#7c3aed',
    pink: '#db2777',
    teal: '#0d9488',
    orange: '#ea580c',
    indigo: '#4f46e5',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    overlay: '#00000020',
    fiction: '#2563eb',
    programming: '#059669',
    science: '#7c3aed',
    history: '#d97706',
    romance: '#db2777',
    fantasy: '#ea580c',
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return a.author.localeCompare(b.author);
      case 'year': return b.year - a.year;
      case 'rating': return b.rating - a.rating;
      case 'borrowCount': return b.borrowCount - a.borrowCount;
      default: return 0;
    }
  });

  // Get unique genres and statuses
  const genres = ['All', ...new Set(books.map(book => book.genre))];
  const statuses = ['All', 'available', 'unavailable', 'reserved'];

  // Calculate stats
  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.status === 'available').length;
  const totalBorrows = books.reduce((sum, book) => sum + book.borrowCount, 0);
  const uniqueGenres = [...new Set(books.map(book => book.genre))].length;

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
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
    },
    bookCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 4px 12px ${colors.overlay}`,
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s',
    },
    bookCover: {
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      position: 'relative' as const,
    },
    bookInfo: {
      padding: '24px',
    },
    bookHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    bookTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: colors.text,
      margin: '0 0 4px 0',
    },
    bookAuthor: {
      fontSize: '14px',
      color: colors.textSecondary,
      margin: '0',
    },
    bookDetails: {
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
    genreBadge: (genre: string) => ({
      background: `linear-gradient(135deg, ${genre === 'fiction' ? colors.fiction :
        genre === 'programming' ? colors.programming :
          genre === 'science' ? colors.science :
            genre === 'history' ? colors.history :
              genre === 'romance' ? colors.romance :
                colors.fantasy
        }, ${genre === 'fiction' ? colors.fiction :
          genre === 'programming' ? colors.programming :
            genre === 'science' ? colors.science :
              genre === 'history' ? colors.history :
                genre === 'romance' ? colors.romance :
                  colors.fantasy
        }dd)`,
      color: 'white',
    }),
    statusBadge: (status: string) => ({
      background: `linear-gradient(135deg, ${status === 'available' ? colors.secondary :
        status === 'unavailable' ? colors.danger :
          colors.warning
        }, ${status === 'available' ? colors.secondary :
          status === 'unavailable' ? colors.danger :
            colors.warning
        }dd)`,
      color: 'white',
    }),
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

  // Get genre label
  const getGenreLabel = (genre: string) => {
    switch (genre) {
      case 'fiction': return 'Fiction';
      case 'programming': return 'Programming';
      case 'science': return 'Science';
      case 'history': return 'History';
      case 'romance': return 'Romance';
      case 'fantasy': return 'Fantasy';
      default: return genre;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'unavailable': return 'Unavailable';
      case 'reserved': return 'Reserved';
      default: return status;
    }
  };

  // Toggle book selection
  const toggleBookSelection = (id: number) => {
    setSelectedBooks(prev =>
      prev.includes(id)
        ? prev.filter(bookId => bookId !== id)
        : [...prev, id]
    );
  };

  // Select all on current page
  const selectAll = () => {
    const pageBookIds = filteredBooks.map(book => book.id);
    if (selectedBooks.length === pageBookIds.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(pageBookIds);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedBooks.length === 0) {
      alert('Please select books first');
      return;
    }

    switch (action) {
      case 'export':
        alert(`Exporting ${selectedBooks.length} books...`);
        break;
      case 'print':
        alert(`Printing labels for ${selectedBooks.length} books...`);
        break;
      case 'delete':
        if (confirm(`Delete ${selectedBooks.length} selected books? This cannot be undone.`)) {
          try {
            // Delete one by one for now as backend doesn't support bulk delete
            for (const id of selectedBooks) {
              await bookAPI.deleteBook(id);
            }
            alert('Books deleted successfully');
            setSelectedBooks([]);
            fetchBooks(); // Refresh list
          } catch (err: any) {
            alert(`Failed to delete books: ${err.message}`);
          }
        }
        break;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(id);
        // Optimistic update or refresh
        setBooks(prev => prev.filter(b => b.id !== id));
      } catch (err: any) {
        alert(`Error deleting book: ${err.message}`);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedStatus('All');
    setSortBy('title');
    setSelectedBooks([]);
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>
          ⌛ Loading your library...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: colors.danger, marginBottom: '10px' }}>Error Loading Books</h2>
        <p style={{ color: colors.textSecondary, marginBottom: '20px' }}>{error}</p>
        <button onClick={fetchBooks} style={styles.button}>🔄 Try Again</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 Book Catalog</h1>
          <p style={styles.subtitle}>
            Browse and manage the library collection
            <span style={{
              marginLeft: '12px',
              fontSize: '14px',
              padding: '4px 12px',
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.purple}20)`,
              borderRadius: '20px',
              border: `1px solid ${colors.primary}40`
            }}>
              {totalBooks} books • {availableBooks} available
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
            href="/books/add"
            style={styles.button}
          >
            📖 Add New Book
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📚 Total Books</p>
          <p style={{
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {totalBooks}
          </p>
          <div style={{
            fontSize: '13px',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>↑ {Math.round((availableBooks / totalBooks) * 100)}% available</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>✅ Available Now</p>
          <p style={{
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.teal})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {availableBooks}
          </p>
          <div style={{
            fontSize: '13px',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>{Math.round((availableBooks / totalBooks) * 100)}% of total</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📖 Total Borrows</p>
          <p style={{
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.teal}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {totalBorrows}
          </p>
          <div style={{
            fontSize: '13px',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>Avg: {Math.round(totalBorrows / totalBooks)} per book</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statTitle}>📂 Genres</p>
          <p style={{
            ...styles.statValue,
            background: `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {uniqueGenres}
          </p>
          <div style={{
            fontSize: '13px',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px'
          }}>
            <span>Across {totalBooks} books</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBooks.length > 0 && (
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
              {selectedBooks.length}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: colors.text }}>
                {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''} selected
              </div>
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                Choose an action to perform on selected books
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
              onClick={() => handleBulkAction('print')}
              style={styles.button}
            >
              🖨️ Print Labels
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              style={{
                ...styles.button,
                background: `linear-gradient(135deg, ${colors.danger}, #b91c1c)`,
              }}
            >
              🗑️ Delete Selected
            </button>
            <button
              onClick={() => setSelectedBooks([])}
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
            🔍 Search & Filter Books
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
            placeholder="Search by title, author, ISBN, or publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '14px 20px',
              border: `2px solid ${colors.border}`,
              borderRadius: '12px',
              fontSize: '14px',
              backgroundColor: colors.cardBg,
              color: colors.text,
              minWidth: '160px',
            }}
          >
            <option value="title">Sort by: Title</option>
            <option value="author">Sort by: Author</option>
            <option value="year">Sort by: Year (Newest)</option>
            <option value="rating">Sort by: Rating</option>
            <option value="borrowCount">Sort by: Popularity</option>
          </select>
          <button
            onClick={resetFilters}
            style={styles.outlineButton}
          >
            🔄 Reset All
          </button>
        </div>

        {/* View Toggle */}
        <div style={styles.filterContainer}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              ...styles.filterButton,
              ...(viewMode === 'grid' ? styles.activeFilter : {})
            }}
          >
            📱 Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              ...styles.filterButton,
              ...(viewMode === 'list' ? styles.activeFilter : {})
            }}
          >
            📋 List View
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
              {/* Genre Filter */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                  Genre
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      style={{
                        ...styles.filterButton,
                        ...(selectedGenre === genre ? {
                          background: `linear-gradient(135deg, ${genre === 'All' ? colors.primary :
                            genre === 'fiction' ? colors.fiction :
                              genre === 'programming' ? colors.programming :
                                genre === 'science' ? colors.science :
                                  genre === 'history' ? colors.history :
                                    genre === 'romance' ? colors.romance :
                                      colors.fantasy
                            }, ${genre === 'All' ? colors.purple :
                              genre === 'fiction' ? colors.fiction :
                                genre === 'programming' ? colors.programming :
                                  genre === 'science' ? colors.science :
                                    genre === 'history' ? colors.history :
                                      genre === 'romance' ? colors.romance :
                                        colors.fantasy
                            })`,
                          color: 'white',
                          borderColor: genre === 'All' ? colors.primary :
                            genre === 'fiction' ? colors.fiction :
                              genre === 'programming' ? colors.programming :
                                genre === 'science' ? colors.science :
                                  genre === 'history' ? colors.history :
                                    genre === 'romance' ? colors.romance :
                                      colors.fantasy,
                        } : {})
                      }}
                    >
                      {genre === 'All' ? 'All Genres' : getGenreLabel(genre)}
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
                          background: `linear-gradient(135deg, ${status === 'All' ? colors.primary :
                            status === 'available' ? colors.secondary :
                              status === 'unavailable' ? colors.danger :
                                colors.warning
                            }, ${status === 'All' ? colors.purple :
                              status === 'available' ? colors.secondary :
                                status === 'unavailable' ? colors.danger :
                                  colors.warning
                            })`,
                          color: 'white',
                          borderColor: status === 'All' ? colors.primary :
                            status === 'available' ? colors.secondary :
                              status === 'unavailable' ? colors.danger :
                                colors.warning,
                        } : {})
                      }}
                    >
                      {status === 'All' ? 'All Status' : getStatusLabel(status)}
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
            Showing {filteredBooks.length} of {totalBooks} books
            {selectedGenre !== 'All' && ` • Genre: ${getGenreLabel(selectedGenre)}`}
            {selectedStatus !== 'All' && ` • Status: ${getStatusLabel(selectedStatus)}`}
            {sortBy !== 'title' && ` • Sorted by: ${sortBy}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
              onChange={selectAll}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontSize: '13px', color: colors.textSecondary }}>
              Select all {filteredBooks.length} books
            </span>
          </div>
        </div>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📚</div>
          <h3 style={{ fontSize: '24px', color: colors.text, marginBottom: '12px' }}>
            No books found
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
          {filteredBooks.map(book => {
            const availabilityPercentage = (book.availableCopies / book.totalCopies) * 100;

            return (
              <div key={book.id} style={styles.bookCard}>
                {/* Book Cover */}
                <div style={{ ...styles.bookCover, backgroundColor: book.coverColor }}>
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => toggleBookSelection(book.id)}
                    style={{
                      position: 'absolute' as const,
                      top: '16px',
                      right: '16px',
                      transform: 'scale(1.3)',
                    }}
                  />

                  {/* Book Icon */}
                  <div style={{ fontSize: '64px', opacity: 0.8 }}>📚</div>

                  {/* Status Badge */}
                  <div style={{ position: 'absolute' as const, bottom: '16px', left: '16px' }}>
                    <span style={{ ...styles.badge, ...styles.statusBadge(book.status), fontSize: '11px' }}>
                      {getStatusLabel(book.status)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div style={{
                    position: 'absolute' as const,
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    ⭐ {book.rating}
                  </div>
                </div>

                {/* Book Info */}
                <div style={styles.bookInfo}>
                  {/* Header */}
                  <div style={styles.bookHeader}>
                    <div>
                      <h3 style={styles.bookTitle}>{book.title}</h3>
                      <p style={styles.bookAuthor}>by {book.author}</p>
                    </div>
                    <span style={{ ...styles.badge, ...styles.genreBadge(book.genre), fontSize: '11px' }}>
                      {getGenreLabel(book.genre)}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={styles.bookDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 Year</span>
                      <span style={styles.detailValue}>{book.year}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📊 ISBN</span>
                      <span style={styles.detailValue}>{book.isbn}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🏢 Publisher</span>
                      <span style={styles.detailValue}>{book.publisher}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📖 Pages</span>
                      <span style={styles.detailValue}>{book.pages}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📍 Location</span>
                      <span style={styles.detailValue}>{book.location}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📚 Availability</span>
                      <span style={styles.detailValue}>
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(
                        availabilityPercentage,
                        availabilityPercentage > 50 ? colors.secondary :
                          availabilityPercentage > 20 ? colors.warning : colors.danger
                      )} />
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Total Borrows</span>
                      <span style={styles.detailValue}>
                        {book.borrowCount}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: '13px',
                    color: colors.textSecondary,
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    maxHeight: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {book.description}
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <Link href={`/books/${book.id}`} style={{ ...styles.smallButton, textDecoration: 'none' }}>
                      👁️ View
                    </Link>
                    <Link href={`/books/edit/${book.id}`} style={{
                      ...styles.smallButton,
                      textDecoration: 'none',
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}>
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      style={{
                        ...styles.smallButton,
                        borderColor: colors.danger,
                        color: colors.danger,
                      }}>
                      🗑️ Delete
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
                      checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                      onChange={selectAll}
                      style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    Book Details
                  </th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Genre</th>
                  <th style={styles.th}>Availability</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id} style={{
                    backgroundColor: selectedBooks.includes(book.id)
                      ? (darkMode ? '#1e3a8a20' : '#dbeafe')
                      : 'transparent',
                  }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() => toggleBookSelection(book.id)}
                          style={{ transform: 'scale(1.1)' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: book.coverColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '20px',
                          }}>
                            📚
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px' }}>{book.title}</div>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                              {book.year} • {book.publisher} • ISBN: {book.isbn}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{book.author}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...styles.genreBadge(book.genre), fontSize: '11px' }}>
                        {getGenreLabel(book.genre)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                          {book.availableCopies}/{book.totalCopies}
                        </div>
                        <div style={styles.progressBar}>
                          <div style={styles.progressFill(
                            (book.availableCopies / book.totalCopies) * 100,
                            colors.secondary
                          )} />
                        </div>
                        <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '4px' }}>
                          {book.borrowCount} borrows
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>⭐</span>
                        <span style={{ fontWeight: 600 }}>{book.rating}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/books/${book.id}`} style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                          textDecoration: 'none'
                        }}>
                          👁️
                        </Link>
                        <Link href={`/books/edit/${book.id}`} style={{
                          ...styles.smallButton,
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderColor: colors.primary,
                          color: colors.primary,
                          textDecoration: 'none'
                        }}>
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id)}
                          style={{
                            ...styles.smallButton,
                            padding: '6px 12px',
                            fontSize: '12px',
                            borderColor: colors.danger,
                            color: colors.danger,
                          }}>
                          🗑️
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
          📚 Library Catalog • {availableBooks} available • Last updated: Today
        </p>
        <p style={{ margin: 0 }}>
          Need to import books in bulk? Use the <Link href="/import" style={{
            color: colors.primary,
            textDecoration: 'none',
            fontWeight: 500,
          }}>Import Tool</Link>
        </p>
      </div>
    </div>
  );
}
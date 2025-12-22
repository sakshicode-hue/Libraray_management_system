// app/books/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('title');

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

  // Mock book data
  const mockBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      genre: 'fiction',
      year: 1925,
      publisher: 'Scribner',
      totalCopies: 5,
      availableCopies: 3,
      status: 'available',
      rating: 4.5,
      borrowCount: 245,
      description: 'A classic novel of the Jazz Age exploring themes of idealism, resistance to change, social upheaval, and excess.',
      language: 'English',
      pages: 180,
      location: 'Shelf A1-05',
      coverColor: '#fbbf24',
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      genre: 'fiction',
      year: 1960,
      publisher: 'J.B. Lippincott & Co.',
      totalCopies: 4,
      availableCopies: 2,
      status: 'available',
      rating: 4.8,
      borrowCount: 312,
      description: 'A novel about racial injustice and moral growth in the American South during the Great Depression.',
      language: 'English',
      pages: 281,
      location: 'Shelf A1-06',
      coverColor: '#10b981',
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      genre: 'science',
      year: 1949,
      publisher: 'Secker & Warburg',
      totalCopies: 8,
      availableCopies: 5,
      status: 'available',
      rating: 4.7,
      borrowCount: 289,
      description: 'A dystopian social science fiction novel about totalitarian surveillance and thought control.',
      language: 'English',
      pages: 328,
      location: 'Shelf B2-01',
      coverColor: '#6b7280',
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      genre: 'romance',
      year: 1813,
      publisher: 'T. Egerton',
      totalCopies: 3,
      availableCopies: 1,
      status: 'available',
      rating: 4.6,
      borrowCount: 198,
      description: 'A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.',
      language: 'English',
      pages: 432,
      location: 'Shelf A2-03',
      coverColor: '#ec4899',
    },
    {
      id: 5,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '9780316769488',
      genre: 'fiction',
      year: 1951,
      publisher: 'Little, Brown and Company',
      totalCopies: 6,
      availableCopies: 4,
      status: 'available',
      rating: 4.3,
      borrowCount: 223,
      description: 'A story about Holden Caulfield\'s experiences in New York City after being expelled from prep school.',
      language: 'English',
      pages: 277,
      location: 'Shelf B1-07',
      coverColor: '#ef4444',
    },
    {
      id: 6,
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      isbn: '9781593279288',
      genre: 'programming',
      year: 2019,
      publisher: 'No Starch Press',
      totalCopies: 10,
      availableCopies: 6,
      status: 'available',
      rating: 4.9,
      borrowCount: 156,
      description: 'A hands-on, project-based introduction to programming using Python.',
      language: 'English',
      pages: 544,
      location: 'Shelf C1-01',
      coverColor: '#3b82f6',
    },
    {
      id: 7,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      genre: 'programming',
      year: 2008,
      publisher: 'Prentice Hall',
      totalCopies: 5,
      availableCopies: 2,
      status: 'available',
      rating: 4.8,
      borrowCount: 189,
      description: 'A handbook of agile software craftsmanship that guides developers to write better code.',
      language: 'English',
      pages: 464,
      location: 'Shelf C1-02',
      coverColor: '#6366f1',
    },
    {
      id: 8,
      title: 'The Design of Everyday Things',
      author: 'Don Norman',
      isbn: '9780465050659',
      genre: 'science',
      year: 2013,
      publisher: 'Basic Books',
      totalCopies: 4,
      availableCopies: 3,
      status: 'available',
      rating: 4.7,
      borrowCount: 134,
      description: 'A guide to human-centered design principles for creating intuitive and user-friendly products.',
      language: 'English',
      pages: 368,
      location: 'Shelf D1-04',
      coverColor: '#8b5cf6',
    },
    {
      id: 9,
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      genre: 'history',
      year: 2015,
      publisher: 'Harper',
      totalCopies: 7,
      availableCopies: 0,
      status: 'unavailable',
      rating: 4.6,
      borrowCount: 278,
      description: 'An exploration of the history of humankind from the Stone Age to the 21st century.',
      language: 'English',
      pages: 443,
      location: 'Shelf E2-01',
      coverColor: '#f59e0b',
    },
    {
      id: 10,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      genre: 'science',
      year: 2018,
      publisher: 'Avery',
      totalCopies: 6,
      availableCopies: 2,
      status: 'available',
      rating: 4.8,
      borrowCount: 167,
      description: 'A proven framework for building good habits and breaking bad ones.',
      language: 'English',
      pages: 320,
      location: 'Shelf F1-03',
      coverColor: '#14b8a6',
    },
    {
      id: 11,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      isbn: '9780062315007',
      genre: 'fiction',
      year: 1988,
      publisher: 'HarperOne',
      totalCopies: 8,
      availableCopies: 3,
      status: 'available',
      rating: 4.5,
      borrowCount: 345,
      description: 'A philosophical novel about following one\'s dreams and listening to one\'s heart.',
      language: 'Portuguese',
      pages: 208,
      location: 'Shelf A3-02',
      coverColor: '#f97316',
    },
    {
      id: 12,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      isbn: '9780374533557',
      genre: 'science',
      year: 2011,
      publisher: 'Farrar, Straus and Giroux',
      totalCopies: 5,
      availableCopies: 1,
      status: 'available',
      rating: 4.7,
      borrowCount: 198,
      description: 'A book about two systems that drive the way we think and make decisions.',
      language: 'English',
      pages: 499,
      location: 'Shelf G1-05',
      coverColor: '#0d9488',
    },
  ];

  // Filter books
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
    
    return matchesSearch && matchesGenre && matchesStatus;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return a.author.localeCompare(b.author);
      case 'year': return b.year - a.year;
      case 'rating': return b.rating - a.rating;
      case 'borrowCount': return b.borrowCount - a.borrowCount;
      default: return 0;
    }
  });

  // Get unique genres and statuses
  const genres = ['All', ...new Set(mockBooks.map(book => book.genre))];
  const statuses = ['All', 'available', 'unavailable', 'reserved'];

  // Calculate stats
  const totalBooks = mockBooks.length;
  const availableBooks = mockBooks.filter(b => b.status === 'available').length;
  const totalBorrows = mockBooks.reduce((sum, book) => sum + book.borrowCount, 0);
  const uniqueGenres = [...new Set(mockBooks.map(book => book.genre))].length;

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
      position: 'relative',
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
      background: `linear-gradient(135deg, ${
        genre === 'fiction' ? colors.fiction :
        genre === 'programming' ? colors.programming :
        genre === 'science' ? colors.science :
        genre === 'history' ? colors.history :
        genre === 'romance' ? colors.romance :
        colors.fantasy
      }, ${
        genre === 'fiction' ? colors.fiction :
        genre === 'programming' ? colors.programming :
        genre === 'science' ? colors.science :
        genre === 'history' ? colors.history :
        genre === 'romance' ? colors.romance :
        colors.fantasy
      }dd)`,
      color: 'white',
    }),
    statusBadge: (status: string) => ({
      background: `linear-gradient(135deg, ${
        status === 'available' ? colors.secondary :
        status === 'unavailable' ? colors.danger :
        colors.warning
      }, ${
        status === 'available' ? colors.secondary :
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
    switch(genre) {
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
    switch(status) {
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
  const handleBulkAction = (action: string) => {
    if (selectedBooks.length === 0) {
      alert('Please select books first');
      return;
    }
    
    switch(action) {
      case 'export':
        alert(`Exporting ${selectedBooks.length} books...`);
        break;
      case 'print':
        alert(`Printing labels for ${selectedBooks.length} books...`);
        break;
      case 'delete':
        if (confirm(`Delete ${selectedBooks.length} selected books?`)) {
          alert('Books deleted (simulated)');
          setSelectedBooks([]);
        }
        break;
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
                          background: `linear-gradient(135deg, ${
                            genre === 'All' ? colors.primary :
                            genre === 'fiction' ? colors.fiction :
                            genre === 'programming' ? colors.programming :
                            genre === 'science' ? colors.science :
                            genre === 'history' ? colors.history :
                            genre === 'romance' ? colors.romance :
                            colors.fantasy
                          }, ${
                            genre === 'All' ? colors.purple :
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
                          background: `linear-gradient(135deg, ${
                            status === 'All' ? colors.primary :
                            status === 'available' ? colors.secondary :
                            status === 'unavailable' ? colors.danger :
                            colors.warning
                          }, ${
                            status === 'All' ? colors.purple :
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
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      transform: 'scale(1.3)',
                    }}
                  />
                  
                  {/* Book Icon */}
                  <div style={{ fontSize: '64px', opacity: 0.8 }}>📚</div>
                  
                  {/* Status Badge */}
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                    <span style={{ ...styles.badge, ...styles.statusBadge(book.status), fontSize: '11px' }}>
                      {getStatusLabel(book.status)}
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div style={{ 
                    position: 'absolute', 
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
                      borderColor: book.status === 'available' ? colors.secondary : colors.warning,
                      color: book.status === 'available' ? colors.secondary : colors.warning,
                    }}>
                      {book.status === 'available' ? '📖 Borrow' : '🔔 Notify'}
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
                          📖
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
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookAPI } from '@/lib/api';

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publication_year: '',
    total_copies: 1,
    description: '',
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      const copies = parseInt(formData.total_copies.toString());
      if (isNaN(copies) || copies < 1) {
        throw new Error("Total copies must be a valid number greater than 0");
      }

      // Prepare payload - convert numbers
      const payload = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        category: formData.category,
        publisher: formData.publisher || null,
        publication_year: formData.publication_year ? parseInt(formData.publication_year.toString()) : null,
        total_copies: copies,
        description: formData.description || null,
      };

      console.log('Sending payload:', payload); // Debug log

      await bookAPI.createBook(payload);
      alert('Book added successfully!');
      router.push('/books');
    } catch (err: any) {
      console.error('Create error:', err);
      const errorMessage = err.detail || err.message || "Unknown error occurred";
      setError(errorMessage.toString());
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const colors = darkMode ? {
    primary: '#3b82f6',
    background: '#111827',
    cardBg: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    inputBg: '#374151',
  } : {
    primary: '#2563eb',
    background: '#f9fafb',
    cardBg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    inputBg: '#f9fafb',
  };

  const styles = {
    container: {
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      border: `1px solid ${colors.border}`,
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      marginBottom: '32px',
      color: colors.text,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500,
      fontSize: '14px',
      color: colors.textSecondary,
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.inputBg,
      color: colors.text,
      fontSize: '15px',
      transition: 'border-color 0.2s',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.inputBg,
      color: colors.text,
      fontSize: '15px',
      minHeight: '120px',
      resize: 'vertical' as const,
      outline: 'none',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '16px',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: `1px solid ${colors.border}`,
    },
    saveButton: {
      padding: '12px 32px',
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: loading ? 0.7 : 1,
    },
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => router.back()}
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
        ← Back
      </button>

      <div style={styles.card}>
        <h1 style={styles.title}>📖 Add New Book</h1>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. The Great Gatsby"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. F. Scott Fitzgerald"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. 978-0743273565"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Programming">Programming</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Publisher</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Publication Year</label>
              <input
                type="number"
                name="publication_year"
                value={formData.publication_year}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Copies *</label>
              <input
                type="number"
                name="total_copies"
                value={formData.total_copies}
                onChange={handleChange}
                required
                min="1"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter book description..."
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => router.back()}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

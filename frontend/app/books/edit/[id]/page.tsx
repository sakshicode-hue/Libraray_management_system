"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { bookAPI } from '@/lib/api';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
    fetchBookData();
  }, [id, router]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const data = await bookAPI.getBook(id);
      setFormData({
        title: data.title || '',
        author: data.author || '',
        isbn: data.isbn || '',
        category: data.category || '',
        publisher: data.publisher || '',
        publication_year: data.publication_year?.toString() || '',
        total_copies: data.total_copies || 1,
        description: data.description || '',
      });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching book:', err);
      setError("Failed to load book data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare payload - convert numbers
      const payload = {
        ...formData,
        publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
        total_copies: parseInt(formData.total_copies.toString()),
      };

      await bookAPI.updateBook(id, payload);
      alert('Book updated successfully!');
      router.push(`/books/${id}`);
    } catch (err: any) {
      console.error('Update error:', err);
      alert(`Failed to update book: ${err.detail || err.message}`);
    } finally {
      setSaving(false);
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
      opacity: saving ? 0.7 : 1,
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

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: colors.text }}>Loading form...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>
        <button onClick={() => router.push('/books')} style={styles.cancelButton}>Back to Books</button>
      </div>
    );
  }

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
        <h1 style={styles.title}>✏️ Edit Book</h1>

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
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// API Configuration
// Point directly to backend to avoid potential proxy header stripping issues
const API_BASE_URL = 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

// Helper function to handle API responses
async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
}

// Authentication APIs
export const authAPI = {
    register: async (data: { email: string; password: string; full_name: string; role?: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await handleResponse(response);

        // Store token in localStorage
        if (typeof window !== 'undefined' && data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    logout: async () => {
        try {
            await fetchWithAuth('/auth/logout', { method: 'POST' });
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        }
    },

    forgotPassword: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return handleResponse(response);
    },

    resetPassword: async (token: string, new_password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password }),
        });
        return handleResponse(response);
    },

    getRoles: async () => {
        return fetchWithAuth('/auth/roles');
    },
};

// Book APIs
export const bookAPI = {
    getBooks: async (params?: { page?: number; page_size?: number; category?: string; author?: string; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.category) queryParams.append('category', params.category);
        if (params?.author) queryParams.append('author', params.author);
        if (params?.search) queryParams.append('search', params.search);

        const url = `/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return fetchWithAuth(url);
    },

    getBook: async (id: string) => {
        return fetchWithAuth(`/books/${id}`);
    },

    createBook: async (data: any) => {
        return fetchWithAuth('/books', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateBook: async (id: string, data: any) => {
        return fetchWithAuth(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteBook: async (id: string) => {
        return fetchWithAuth(`/books/${id}`, {
            method: 'DELETE',
        });
    },

    getCategories: async () => {
        return fetchWithAuth('/books/categories');
    },

    getAuthors: async () => {
        return fetchWithAuth('/books/authors');
    },

    checkAvailability: async (id: string) => {
        return fetchWithAuth(`/books/${id}/availability`);
    },

    uploadBook: async (formData: FormData) => {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/books/upload`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
        });
        return handleResponse(response);
    },
};

// Member APIs
export const memberAPI = {
    getMembers: async (page: number = 1, page_size: number = 20) => {
        return fetchWithAuth(`/members?page=${page}&page_size=${page_size}`);
    },

    createMember: async (data: any) => {
        return fetchWithAuth('/members', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateMember: async (id: string, data: any) => {
        return fetchWithAuth(`/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    searchMembers: async (query: string, page: number = 1) => {
        return fetchWithAuth(`/members/search?q=${encodeURIComponent(query)}&page=${page}`);
    },

    getMemberProfile: async (id: string) => {
        return fetchWithAuth(`/members/${id}/profile`);
    },

    getBorrowingHistory: async (id: string) => {
        return fetchWithAuth(`/members/${id}/history`);
    },
};

// Transaction APIs
export const transactionAPI = {
    borrowBook: async (member_id: string, book_id: string) => {
        return fetchWithAuth('/transactions/borrow', {
            method: 'POST',
            body: JSON.stringify({ member_id, book_id }),
        });
    },

    returnBook: async (transaction_id: string) => {
        return fetchWithAuth('/transactions/return', {
            method: 'POST',
            body: JSON.stringify({ transaction_id }),
        });
    },

    getHistory: async (member_id?: string, page: number = 1, page_size: number = 100) => {
        const url = `/transactions/history?page=${page}&page_size=${page_size}${member_id ? `&member_id=${member_id}` : ''}`;
        return fetchWithAuth(url);
    },

    getOverdue: async () => {
        return fetchWithAuth('/transactions/overdue');
    },

    getAvailableBooks: async (search?: string, category?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        return fetchWithAuth(`/transactions/available-books?${params.toString()}`);
    },

    checkEligibility: async (member_id: string) => {
        return fetchWithAuth(`/transactions/eligibility/${member_id}`);
    },
};

// Fine APIs
export const fineAPI = {
    getFines: async (member_id?: string, status?: string, page: number = 1) => {
        const params = new URLSearchParams({ page: page.toString() });
        if (member_id) params.append('member_id', member_id);
        if (status) params.append('status', status);
        return fetchWithAuth(`/fines?${params.toString()}`);
    },

    payFine: async (fine_id: string, payment_data: any) => {
        return fetchWithAuth(`/fines/${fine_id}/pay`, {
            method: 'POST',
            body: JSON.stringify(payment_data),
        });
    },

    waiveFine: async (fine_id: string, reason: string) => {
        return fetchWithAuth(`/fines/${fine_id}/waive`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },

    getSummary: async (member_id?: string) => {
        const url = `/fines/summary${member_id ? `?member_id=${member_id}` : ''}`;
        return fetchWithAuth(url);
    },
};

// Reservation APIs
export const reservationAPI = {
    getReservations: async (member_id?: string, book_id?: string) => {
        const params = new URLSearchParams();
        if (member_id) params.append('member_id', member_id);
        if (book_id) params.append('book_id', book_id);
        return fetchWithAuth(`/reservations?${params.toString()}`);
    },

    createReservation: async (member_id: string, book_id: string) => {
        return fetchWithAuth('/reservations', {
            method: 'POST',
            body: JSON.stringify({ member_id, book_id }),
        });
    },

    cancelReservation: async (reservation_id: string) => {
        return fetchWithAuth(`/reservations/${reservation_id}`, {
            method: 'DELETE',
        });
    },

    getQueue: async (book_id: string) => {
        return fetchWithAuth(`/reservations/queue/${book_id}`);
    },
};

// Search APIs
export const searchAPI = {
    advancedSearch: async (params: any) => {
        return fetchWithAuth('/search/advanced', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    getSuggestions: async (query: string, type: string = 'all') => {
        return fetchWithAuth(`/search/suggestions?q=${encodeURIComponent(query)}&type=${type}`);
    },

    getRecommendations: async (member_id: string) => {
        return fetchWithAuth(`/search/recommendations/${member_id}`);
    },

    semanticSearch: async (query: string) => {
        return fetchWithAuth(`/search/semantic?query=${encodeURIComponent(query)}`, {
            method: 'POST',
        });
    },
};

// E-Book APIs
export const ebookAPI = {
    getEbooks: async (category?: string) => {
        const url = `/ebooks${category ? `?category=${category}` : ''}`;
        return fetchWithAuth(url);
    },

    uploadEbook: async (formData: FormData) => {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/ebooks/upload`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
        });
        return handleResponse(response);
    },

    downloadEbook: async (ebook_id: string) => {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/ebooks/${ebook_id}/download`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
    },

    saveBookmark: async (ebook_id: string, page_number: number) => {
        return fetchWithAuth(`/ebooks/${ebook_id}/bookmark`, {
            method: 'POST',
            body: JSON.stringify({ page_number }),
        });
    },

    getBookmark: async (ebook_id: string) => {
        return fetchWithAuth(`/ebooks/${ebook_id}/bookmark`);
    },
};

// Report APIs
export const reportAPI = {
    getBorrowingReport: async (start_date?: string, end_date?: string) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return fetchWithAuth(`/reports/borrowing?${params.toString()}`);
    },

    getFinesReport: async (start_date?: string, end_date?: string) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return fetchWithAuth(`/reports/fines?${params.toString()}`);
    },

    getPopularBooks: async (limit: number = 10) => {
        return fetchWithAuth(`/reports/popular-books?limit=${limit}`);
    },

    generateCustomReport: async (params: any) => {
        return fetchWithAuth('/reports/custom', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    exportReport: async (report_data: any, format: string = 'csv') => {
        return fetchWithAuth(`/reports/export?format=${format}`, {
            method: 'POST',
            body: JSON.stringify(report_data),
        });
    },
};

// System APIs
export const systemAPI = {
    getSettings: async () => {
        return fetchWithAuth('/system/settings');
    },

    updateSettings: async (key: string, value: string, description?: string) => {
        return fetchWithAuth('/system/settings', {
            method: 'PUT',
            body: JSON.stringify({ key, value, description }),
        });
    },

    healthCheck: async () => {
        const response = await fetch(`${API_BASE_URL}/system/health`);
        return handleResponse(response);
    },

    getStaff: async () => {
        return fetchWithAuth('/system/staff');
    },

    addStaff: async (data: any) => {
        return fetchWithAuth('/system/staff', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// AI APIs
export const aiAPI = {
    chat: async (message: string, conversation_id?: string) => {
        return fetchWithAuth('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message, conversation_id }),
        });
    },

    query: async (query: string) => {
        return fetchWithAuth('/ai/query', {
            method: 'POST',
            body: JSON.stringify({ query }),
        });
    },

    getAnalytics: async () => {
        return fetchWithAuth('/ai/analytics');
    },
};

// Export all APIs
export const api = {
    auth: authAPI,
    books: bookAPI,
    members: memberAPI,
    transactions: transactionAPI,
    fines: fineAPI,
    reservations: reservationAPI,
    search: searchAPI,
    ebooks: ebookAPI,
    reports: reportAPI,
    system: systemAPI,
    ai: aiAPI,
};

export default api;

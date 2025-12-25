# Excel Data Import Guide

This guide explains how to import your Excel dataset into the Library Management System.

## 📋 Prerequisites

1. **Install dependencies:**
   ```bash
   pip install pandas openpyxl
   ```
   Or install all requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare your Excel file** with data organized in sheets

## 📊 Excel File Structure

The import script supports multiple sheets and can auto-detect the data type. You can organize your data in one of these ways:

### Option 1: Multiple Sheets (Recommended)
- **Sheet 1: "Books"** - Book data
- **Sheet 2: "Users"** - User accounts
- **Sheet 3: "Members"** - Member profiles
- **Sheet 4: "Transactions"** - Borrowing history

### Option 2: Single Sheet
- One sheet with all data (script will try to auto-detect)

## 📝 Column Requirements

### Books Sheet
**Required columns:**
- `title` (or `book_title`, `name`)
- `author` (or `writer`, `author_name`)
- `isbn` (or `isbn13`, `isbn_13`)
- `category` (or `genre`, `type`)

**Optional columns:**
- `publisher` (or `publishing_house`)
- `publication_year` (or `year`, `publish_year`)
- `total_copies` (or `copies`, `quantity`, `stock`) - Default: 1
- `description` (or `summary`, `synopsis`)
- `cover_image` (or `image`, `cover`, `image_url`)

**Example:**
| title | author | isbn | category | publisher | publication_year | total_copies |
|-------|--------|------|----------|-----------|------------------|--------------|
| The Great Gatsby | F. Scott Fitzgerald | 9780743273565 | Fiction | Scribner | 1925 | 5 |

### Users Sheet
**Required columns:**
- `email` (or `e_mail`, `email_address`)
- `full_name` (or `name`, `fullname`, `user_name`)

**Optional columns:**
- `password` (or `pwd`, `pass`) - Default: "password123"
- `role` (or `user_role`, `type`) - Values: `admin`, `librarian`, `member` - Default: `member`

**Example:**
| email | full_name | password | role |
|-------|-----------|----------|------|
| admin@library.com | Admin User | admin123 | admin |
| librarian@library.com | Librarian Name | lib123 | librarian |
| member@library.com | Member Name | member123 | member |

### Members Sheet
**Required columns:**
- `email` (or `e_mail`, `email_address`, `user_email`) - Must match a user email
- `phone` (or `phone_number`, `mobile`, `contact`)
- `address` (or `location`, `street_address`)

**Optional columns:**
- `membership_type` (or `type`, `member_type`, `plan`) - Values: `standard`, `premium` - Default: `standard`

**Note:** Users must be imported before members (or in the same file with Users sheet first)

**Example:**
| email | phone | address | membership_type |
|-------|-------|---------|-----------------|
| member@library.com | 123-456-7890 | 123 Main St | standard |
| premium@library.com | 987-654-3210 | 456 Oak Ave | premium |

### Transactions Sheet
**Required columns:**
- `member_id` (or `member`, `membership_id`) - Can be membership_id or ObjectId
- `book_id` (or `book`, `isbn`) - Can be ISBN or ObjectId

**Optional columns:**
- `borrow_date` (or `borrowed_date`, `issue_date`, `loan_date`) - Default: current date
- `due_date` (or `return_due_date`) - Default: borrow_date + 14 days
- `return_date` (or `returned_date`) - If provided, status will be "returned"
- `status` (or `transaction_status`) - Values: `borrowed`, `returned` - Auto-detected if return_date exists

**Example:**
| member_id | book_id | borrow_date | due_date | return_date | status |
|-----------|---------|-------------|----------|-------------|--------|
| MEM-123456 | 9780743273565 | 2024-01-15 | 2024-01-29 | 2024-01-28 | returned |
| MEM-789012 | 9780143127741 | 2024-02-01 | 2024-02-15 | | borrowed |

## 🚀 Usage

### Basic Import (Auto-detect)
```bash
python import_excel_data.py your_data.xlsx
```

### Clear Existing Data First
```bash
python import_excel_data.py your_data.xlsx --clear
```

### Import Specific Sheet Only
```bash
python import_excel_data.py your_data.xlsx --sheet "Books"
```

### Force Data Type (Override Auto-detection)
```bash
python import_excel_data.py your_data.xlsx --type books
python import_excel_data.py your_data.xlsx --type users
python import_excel_data.py your_data.xlsx --type members
python import_excel_data.py your_data.xlsx --type transactions
```

## 📋 Import Order

If importing in separate steps, follow this order:

1. **Users** (must be first)
2. **Books** (can be imported anytime)
3. **Members** (requires users to exist)
4. **Transactions** (requires members and books to exist)

## ✅ Example Workflow

1. **Prepare your Excel file:**
   - Create sheets: "Books", "Users", "Members", "Transactions"
   - Fill in data with appropriate columns
   - Save as `.xlsx` format

2. **Clear existing data (optional):**
   ```bash
   python import_excel_data.py data.xlsx --clear
   ```

3. **Import all data:**
   ```bash
   python import_excel_data.py data.xlsx
   ```

4. **Verify import:**
   - Check the console output for import statistics
   - Visit http://localhost:3000/docs to test the API
   - Check your frontend at http://localhost:3001

## 🔍 Troubleshooting

### "Missing required columns" Error
- Check that your column names match the expected names (case-insensitive)
- The script accepts variations like `book_title`, `Book Title`, `BOOK_TITLE`
- Use the `--type` flag to force a specific data type

### "User not found" for Members
- Ensure Users are imported before Members
- Check that email addresses match exactly (case-insensitive)

### "Book not found" for Transactions
- Ensure Books are imported before Transactions
- Check that ISBN or book_id values match existing books

### Date Format Issues
- Dates should be in a recognizable format (YYYY-MM-DD, MM/DD/YYYY, etc.)
- Excel date formats are usually auto-detected

### Duplicate Data
- The script skips duplicates (by ISBN for books, by email for users)
- Use `--clear` flag to remove existing data before import

## 📊 Import Statistics

After import, you'll see a summary:
```
📊 IMPORT SUMMARY
============================================================
BOOKS:
  ✅ Imported: 150
  ❌ Errors: 2
USERS:
  ✅ Imported: 50
  ❌ Errors: 0
MEMBERS:
  ✅ Imported: 45
  ❌ Errors: 5
TRANSACTIONS:
  ✅ Imported: 200
  ❌ Errors: 0
============================================================
```

## 💡 Tips

1. **Column Names:** The script is flexible with column names - use whatever makes sense for your data
2. **Data Types:** Ensure numeric fields (publication_year, total_copies) contain valid numbers
3. **Dates:** Excel date formats are usually handled automatically
4. **Passwords:** If not provided, default password is "password123" - users should change it
5. **Membership IDs:** Automatically generated in format "MEM-XXXXXX"
6. **ISBN Validation:** Duplicate ISBNs will be skipped

## 🎯 Quick Start Example

If you have a simple Excel file with books:

```bash
# 1. Install dependencies
pip install pandas openpyxl

# 2. Run import
python import_excel_data.py books.xlsx --type books

# 3. Check results
# Visit http://localhost:3000/docs and test GET /books
```

## 📞 Need Help?

- Check the console output for specific error messages
- Verify your Excel file structure matches the requirements
- Ensure MongoDB is running and `.env` is configured
- Check that required columns are present in your sheets


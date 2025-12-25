# Direct Excel Import Guide

Yes! You can import **directly from Excel files** without converting to CSV first!

## ✅ Supported Formats

The import script supports:
- **Excel files**: `.xlsx`, `.xls` (direct import)
- **CSV files**: `.csv` (also supported)

## 📋 How to Use Excel Files Directly

### Option 1: Single Sheet Excel File

If your Excel file has one sheet with all your data:

```bash
python import_excel_data.py your_file.xlsx --clear
```

### Option 2: Multiple Sheets Excel File

If your Excel file has multiple sheets (e.g., "Books", "Users", "Members"):

```bash
# Import all sheets (auto-detects)
python import_excel_data.py your_file.xlsx --clear

# Import specific sheet only
python import_excel_data.py your_file.xlsx --sheet "Books" --clear
```

### Option 3: Force Data Type

If you want to force a specific data type:

```bash
python import_excel_data.py your_file.xlsx --type books --clear
python import_excel_data.py your_file.xlsx --type users --clear
python import_excel_data.py your_file.xlsx --type members --clear
```

## 📊 Excel File Structure

### Single Sheet Format
Your Excel file can have one sheet with all columns:
- Column headers in first row
- Data in subsequent rows
- Script auto-detects the data type

### Multiple Sheets Format (Recommended)
Organize your data in separate sheets:

**Sheet 1: "Books"**
| title | authors | isbn_13 | categories | publisher | ... |
|-------|---------|---------|------------|-----------|-----|
| Book 1 | Author 1 | 978... | Fiction | Publisher | ... |

**Sheet 2: "Users"**
| email | full_name | password | role |
|-------|-----------|----------|------|
| user@... | Name | pass123 | member |

**Sheet 3: "Members"**
| email | phone | address | membership_type |
|-------|-------|---------|-----------------|
| user@... | 123... | Address | standard |

## 🚀 Quick Examples

### Example 1: Import from Excel file
```bash
python import_excel_data.py library_data.xlsx --clear
```

### Example 2: Import only Books sheet
```bash
python import_excel_data.py library_data.xlsx --sheet "Books" --clear
```

### Example 3: Import without clearing existing data
```bash
python import_excel_data.py library_data.xlsx
```

## ✨ Advantages of Excel Import

1. **No conversion needed** - Work directly with Excel files
2. **Multiple sheets support** - Organize data in separate sheets
3. **Better formatting** - Excel preserves data types better
4. **Easy editing** - Edit in Excel and import directly

## 📝 Column Mapping

The script automatically recognizes these column names (case-insensitive):

### For Books:
- `title`, `book_title`, `name`
- `authors`, `author`, `writer`
- `isbn_13`, `isbn_10`, `isbn`
- `categories`, `category`, `genre`
- `publisher`, `publishing_house`
- `published_description`, `description`
- `thumbnail`, `cover_image`, `image`
- `page_count`, `page_cour`, `pages`
- `language`
- And more...

## 🔍 Auto-Detection

The script automatically detects:
- **Books**: If sheet has `isbn`, `title`, `author`, `category` columns
- **Users**: If sheet has `email` and `full_name` columns
- **Members**: If sheet has `email`, `phone`, `address` columns
- **Transactions**: If sheet has `member_id`, `book_id`, `borrow_date` columns

## 💡 Tips

1. **Keep column headers in first row** - The script uses row 1 as headers
2. **Use clear column names** - Makes auto-detection easier
3. **Multiple sheets are better** - Easier to organize and import
4. **Check for duplicates** - Script skips duplicates automatically

## 🎯 Current Status

Your current import is working with CSV, but you can switch to Excel anytime:

```bash
# Stop current import if needed
# Then use Excel file:
python import_excel_data.py My_file.xlsx --clear
```

## 📞 Need Help?

- Make sure your Excel file is in the project root directory
- Check that column names match the expected format
- Use `--clear` flag to replace existing data
- Check the console output for any errors


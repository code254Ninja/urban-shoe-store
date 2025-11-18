# Admin Panel Guide

## Overview
The shoe store now includes a complete admin panel for managing your inventory. Admins can add, edit, and delete shoes with all their details.

## Features
- ✅ Secure admin authentication
- ✅ Add new shoes with complete details
- ✅ Edit existing shoes
- ✅ Delete shoes from inventory
- ✅ Real-time updates (localStorage-based)
- ✅ Image URL support
- ✅ Responsive design

## How to Access

### 1. Admin Login
- Click the **shield icon** (🛡️) in the header to access the admin panel
- Or navigate directly to: `/admin/login`
- **Default Password**: `admin123`

### 2. Admin Dashboard
After logging in, you'll be redirected to the admin dashboard where you can:
- View all shoes in a table format
- Add new shoes
- Edit existing shoes
- Delete shoes

## Adding a New Shoe

1. Click the **"Add New Shoe"** button
2. Fill in all required fields:
   - **Shoe Name**: e.g., "Air Max Revolution"
   - **Brand**: e.g., "Nike"
   - **Price**: Current selling price
   - **Original Price**: Price before discount
   - **Category**: Running, Casual, Lifestyle, Skate, Sports, or Formal
   - **Image URL**: Full URL to the shoe image
   - **Available Sizes**: Comma-separated (e.g., "7, 7.5, 8, 8.5, 9")
   - **Available Colors**: Comma-separated (e.g., "Black, White, Red")
   - **Features**: Comma-separated (e.g., "Breathable mesh, Cushioned sole")
   - **Description**: Brief description of the shoe
   - **Rating**: 0-5 star rating (optional, defaults to 4.5)

3. Click **"Add Shoe"** to save

## Editing a Shoe

1. Find the shoe in the inventory table
2. Click the **Edit icon** (pencil)
3. Update any fields
4. Click **"Update Shoe"** to save changes

## Deleting a Shoe

1. Find the shoe in the inventory table
2. Click the **Trash icon**
3. Confirm deletion in the popup

## Data Persistence

- All shoe data is stored in **localStorage**
- Changes are immediately reflected on the storefront
- Data persists across browser sessions
- Initial data is loaded from `/src/data/shoes.js`

## Image URLs

For images, you can use:
- **Unsplash**: `https://images.unsplash.com/photo-[ID]?w=500&h=500&fit=crop`
- **Google Drive**: Share the image publicly and use the thumbnail URL
- **Any public image hosting service**

### Example URLs:
```
https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop
https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w500-h500
```

## Security Notes

⚠️ **Important**: This is a demo implementation. For production use:
- Implement proper backend authentication
- Use a real database instead of localStorage
- Add user roles and permissions
- Use environment variables for sensitive data
- Implement file upload for images

## Changing the Admin Password

To change the admin password, edit the file:
`/src/hooks/useAuth.jsx`

Find this line:
```javascript
const ADMIN_PASSWORD = 'admin123';
```

Change `'admin123'` to your desired password.

## Navigation

- **View Store**: Click "View Store" button in the dashboard to return to the storefront
- **Logout**: Click "Logout" button to exit the admin panel
- **Back to Store**: Available on the login page

## Troubleshooting

### Can't log in?
- Ensure you're using the correct password: `admin123`
- Check browser console for errors

### Changes not showing?
- Refresh the storefront page
- Clear browser cache if needed

### Lost data?
- Data is stored in localStorage
- Clearing browser data will reset to initial shoes

## Technical Details

### Files Structure
```
src/
├── hooks/
│   ├── useAuth.jsx       # Admin authentication
│   └── useShoes.jsx      # Shoes data management
├── components/
│   ├── AdminLogin.jsx    # Login page
│   └── AdminDashboard.jsx # Admin dashboard
└── data/
    └── shoes.js          # Initial shoes data
```

### Routes
- `/` - Main store
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## Support

For issues or questions, check the main README.md or contact the development team.

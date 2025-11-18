# Image Upload Feature Guide

## Overview
The shoe store now has a complete backend server with image upload functionality. You can upload actual image files instead of using URLs!

## ✅ Fixed Issues
- Changed backend port from 5000 to **5001** (port 5000 was in use)
- Both servers now running successfully:
  - **Backend**: http://localhost:5001
  - **Frontend**: http://localhost:3005

## How to Use Image Upload

### 1. Start the Application
Run the following command to start both backend and frontend:
```bash
npm start
```

This will start:
- Express backend server on port 5001
- React frontend on port 3005 (or next available port)

### 2. Access Admin Panel
1. Navigate to http://localhost:3005
2. Click the shield icon (🛡️) in the header
3. Login with password: `admin123`

### 3. Upload Shoe Images

#### Adding a New Shoe:
1. Click **"Add New Shoe"** button
2. Fill in all the shoe details
3. In the **Product Image** section:
   - Click the upload area that says "Choose image file"
   - Select an image from your computer
   - You'll see a preview of the selected image
4. Fill in remaining fields
5. Click **"Add Shoe"** button
6. The image will be uploaded to the server and the shoe will be saved

#### Editing a Shoe:
1. Click the edit icon (pencil) on any shoe
2. The current image will be displayed
3. To change the image:
   - Click the upload area
   - Select a new image
   - The preview will update
4. Click **"Update Shoe"** to save

## Backend Server Details

### API Endpoints
- **POST** `/api/upload` - Upload a single image
- **GET** `/api/images` - List all uploaded images
- **DELETE** `/api/images/:filename` - Delete an image

### Image Storage
- Images are stored in: `/server/uploads/`
- Each image gets a unique filename: `shoe-{timestamp}-{random}.{ext}`
- Accessible at: `http://localhost:5001/uploads/{filename}`

### File Restrictions
- **Supported formats**: JPG, JPEG, PNG, GIF, WebP
- **Max file size**: 5MB
- Only image files are allowed

## Features

✅ **File Upload with Preview**
- Drag and drop support
- Instant image preview before upload
- File type validation

✅ **Progress Indication**
- Loading spinner during upload
- Disabled buttons while uploading
- Success/error feedback

✅ **Image Management**
- Images stored on server filesystem
- Unique filenames prevent conflicts
- Images served statically via Express

✅ **Responsive Design**
- Works on desktop and mobile
- Touch-friendly upload interface

## Troubleshooting

### "Failed to upload image" error
**Solution**: The error you saw was because port 5000 was in use. This has been fixed - the server now uses port 5001.

### Server not starting
```bash
# Make sure no other process is using port 5001
lsof -ti:5001 | xargs kill -9

# Then restart
npm start
```

### Images not displaying
- Ensure the backend server is running on port 5001
- Check that images exist in `/server/uploads/`
- Verify the image URL format: `http://localhost:5001/uploads/{filename}`

### Upload fails
- Check file size (must be < 5MB)
- Verify file format (JPG, PNG, GIF, WebP only)
- Ensure server has write permissions to `/server/uploads/`

## Running Servers Separately

If you need to run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run dev
```

**Both together (recommended):**
```bash
npm start
```

## Production Considerations

For production deployment, consider:

1. **Cloud Storage**: Use AWS S3, Cloudinary, or similar instead of local filesystem
2. **Image Optimization**: Compress and resize images automatically
3. **CDN**: Serve images through a CDN for better performance
4. **Security**: Add authentication to upload endpoints
5. **Validation**: Add more robust image validation (dimensions, content, etc.)
6. **Backup**: Regular backups of uploaded images
7. **HTTPS**: Use secure connections in production

## File Structure

```
shoe-store/
├── server/
│   ├── server.js          # Express backend
│   ├── uploads/           # Image storage (gitignored)
│   └── .gitignore
├── src/
│   └── components/
│       └── AdminDashboard.jsx  # Admin panel with upload
└── package.json           # Dependencies and scripts
```

## Next Steps

You can now:
- ✅ Upload shoe images directly from your computer
- ✅ See instant previews before uploading
- ✅ Store images on your server
- ✅ Images persist across sessions

The system is now fully functional with both URL support (for external images) and file upload support!

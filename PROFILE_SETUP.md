# Profile Features Setup

## Backend Setup
1. Database will auto-update with new columns (name, profile_photo, theme) on next server start
2. Profile routes are now available at `/api/profile/:user_id`

## Mobile Setup

### 1. Install dependencies (already done):
```bash
npm install react-native-image-picker
```

### 2. Configure Cloudinary:
Update `mobile/src/config/profileApi.ts` line 26:
```typescript
const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
```
Replace `YOUR_CLOUD_NAME` with your Cloudinary cloud name.

### 3. iOS Permissions (if using iOS):
Add to `ios/mobile/Info.plist`:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to update your profile picture</string>
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take profile pictures</string>
```

### 4. Android Permissions (already configured):
Permissions are auto-handled by react-native-image-picker.

### 5. Link native modules:
```bash
# iOS
cd ios && pod install && cd ..

# Android - no additional steps needed
```

## Features Added:
- ✅ Profile photo upload via Cloudinary
- ✅ Name field (editable)
- ✅ Dark/Light theme toggle
- ✅ Theme persists in database
- ✅ All screens now respect theme context

## API Endpoints:
- `GET /api/profile/:user_id` - Get user profile
- `PUT /api/profile/:user_id` - Update profile (name, profile_photo, theme)

## Usage:
1. Start backend: `npm run dev`
2. Start mobile: `npm start`
3. Navigate to Profile tab
4. Click "Change Photo" to upload
5. Edit name and click "Update Name"
6. Toggle between Dark/Light theme

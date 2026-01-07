import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { spacing, radius } from '../../theme/colors';
import { AuthContext } from '../../store/auth';
import { ThemeContext } from '../../store/theme';
import { profileApi } from '../../config/profileApi';

export default function ProfileScreen() {
  const { userEmail, userId, signOut } = useContext(AuthContext);
  const { theme, colors, setTheme } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile(userId!);
      setName(data.profile.name || '');
      setProfilePhoto(data.profile.profile_photo || null);
      if (data.profile.theme) {
        setTheme(data.profile.theme);
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }

        const uri = response.assets?.[0]?.uri;
        if (!uri) return;

        try {
          setUploading(true);
          const cloudinaryUrl = await profileApi.uploadToCloudinary(uri);
          await profileApi.updateProfile(userId!, { profile_photo: cloudinaryUrl });
          setProfilePhoto(cloudinaryUrl);
          Alert.alert('Success', 'Profile photo updated');
        } catch (error: any) {
          Alert.alert('Error', error?.message || 'Failed to upload photo');
        } finally {
          setUploading(false);
        }
      }
    );
  };

  const updateName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await profileApi.updateProfile(userId!, { name: name.trim() });
      Alert.alert('Success', 'Name updated');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      setTheme(newTheme);
      await profileApi.updateProfile(userId!, { theme: newTheme });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update theme');
      setTheme(theme);
    }
  };

  if (loading && !name) {
    return (
      <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
      <AppText title style={{ color: colors.text }}>Profile</AppText>
      <AppText muted style={{ marginTop: 6, color: colors.muted }}>
        Manage your account.
      </AppText>

      <Card style={{ marginTop: 14, backgroundColor: colors.surface, borderColor: colors.border }}>
        <View style={styles.photoSection}>
          <Pressable onPress={pickImage} disabled={uploading}>
            <View style={[styles.photoContainer, { borderColor: colors.border }]}>
              {uploading ? (
                <ActivityIndicator color={colors.accent} />
              ) : profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.photo} />
              ) : (
                <AppText style={{ fontSize: 40, color: colors.muted }}>👤</AppText>
              )}
            </View>
          </Pressable>
          <Pressable onPress={pickImage} disabled={uploading} hitSlop={10}>
            <AppText style={{ color: colors.accent, fontWeight: '700', marginTop: 8 }}>
              {uploading ? 'Uploading...' : 'Change Photo'}
            </AppText>
          </Pressable>
        </View>

        <AppText muted style={{ marginTop: 20, marginBottom: 8, color: colors.muted }}>
          Name
        </AppText>
        <AppInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={{ color: colors.text }}
        />
        <AppButton
          title="Update Name"
          variant="secondary"
          onPress={updateName}
          disabled={!name.trim() || loading}
          style={{ marginTop: 12 }}
        />

        <AppText muted style={{ marginTop: 20, marginBottom: 8, color: colors.muted }}>
          Email
        </AppText>
        <AppText style={{ fontWeight: '800', color: colors.text }}>{userEmail ?? '-'}</AppText>

        <AppText muted style={{ marginTop: 20, marginBottom: 8, color: colors.muted }}>
          Theme
        </AppText>
        <View style={styles.themeRow}>
          <Pressable
            onPress={toggleTheme}
            style={[
              styles.themeOption,
              { backgroundColor: colors.surface2, borderColor: colors.border },
              theme === 'dark' && { backgroundColor: colors.accent, borderColor: 'transparent' },
            ]}
          >
            <AppText style={{ fontWeight: '700', color: theme === 'dark' ? colors.bg : colors.text }}>
              🌙 Dark
            </AppText>
          </Pressable>
          <Pressable
            onPress={toggleTheme}
            style={[
              styles.themeOption,
              { backgroundColor: colors.surface2, borderColor: colors.border },
              theme === 'light' && { backgroundColor: colors.accent, borderColor: 'transparent' },
            ]}
          >
            <AppText style={{ fontWeight: '700', color: theme === 'light' ? colors.bg : colors.text }}>
              ☀️ Light
            </AppText>
          </Pressable>
        </View>

        <AppButton title="Sign out" variant="secondary" onPress={signOut} style={{ marginTop: 20 }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 18,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

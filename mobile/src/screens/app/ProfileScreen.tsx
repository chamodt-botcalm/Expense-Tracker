import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AppText from "../../components/AppText";
import Card from "../../components/Card";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import CloudinaryPhotoPicker from "../../components/CloudinaryPhotoPicker";
import { spacing } from "../../theme/colors";
import { AuthContext } from "../../store/auth";
import { ThemeContext } from "../../store/theme";
import { profileApi } from "../../config/profileApi";

export default function ProfileScreen() {
  const { userEmail, userId, signOut } = useContext(AuthContext);
  const { theme, colors, setTheme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    if (userId) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile(userId!);
      setName(data.profile.name || "");
      setProfilePhoto(data.profile.profile_photo || null);
      if (data.profile.theme) setTheme(data.profile.theme);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPhotoUploaded = async (url: string) => {
    try {
      await profileApi.updateProfile(userId!, { profile_photo: url });
      setProfilePhoto(url);
      Alert.alert("Success", "Profile photo updated");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update profile");
    }
  };

  const updateName = async () => {
    try {
      if (!name.trim()) return Alert.alert("Name required", "Please enter a name.");
      setSavingName(true);
      const data = await profileApi.updateProfile(userId!, { name: name.trim() });
      setName(data.profile.name || "");
      Alert.alert("Updated", "Name updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      setSavingTheme(true);
      await profileApi.updateProfile(userId!, { theme: next });
      setTheme(next);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update theme");
    } finally {
      setSavingTheme(false);
    }
  };

  if (!userId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppText>Please sign in to view your profile.</AppText>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <View style={styles.center}>
          <CloudinaryPhotoPicker value={profilePhoto} onChange={onPhotoUploaded} />
          <AppText style={[styles.email, { color: colors.text }]}>{userEmail}</AppText>
        </View>

        <View style={{ height: 16 }} />

        <AppInput placeholder="Your name" value={name} onChangeText={setName} />

        <View style={{ height: 12 }} />

        <AppButton title={savingName ? "Updating..." : "Update Name"} onPress={updateName} disabled={savingName} />

        <View style={{ height: 18 }} />

        <AppButton
          title={savingTheme ? "Updating..." : `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
          onPress={toggleTheme}
          disabled={savingTheme}
        />

        <View style={{ height: 18 }} />

        <AppButton title="Sign Out" onPress={signOut} variant="ghost" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  center: {
    alignItems: "center",
    gap: 10,
  },
  email: {
    opacity: 0.9,
  },
});

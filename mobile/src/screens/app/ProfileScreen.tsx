import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AppText from "../../components/AppText";
import Card from "../../components/Card";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import CloudinaryPhotoPicker from "../../components/CloudinaryPhotoPicker";
import CustomSwitch from "../../components/Switch";
import { spacing } from "../../theme/colors";
import { AuthContext } from "../../store/auth";
import { ThemeContext } from "../../store/theme";
import { ProfileContext } from "../../store/profile";
import { profileApi } from "../../config/profileApi";

export default function ProfileScreen() {
  const { userEmail, userId, signOut } = useContext(AuthContext);
  const { theme, colors, setTheme } = useContext(ThemeContext);
  const { name: profileName, profilePhoto, updateName, updatePhoto } = useContext(ProfileContext);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setName(profileName);
  }, [profileName]);

  const onPhotoUploaded = async (url: string) => {
    try {
      await updatePhoto(userId!, url);
      Alert.alert("Success", "Profile photo updated");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update profile");
    }
  };

  const handleUpdateName = async () => {
    try {
      if (!name.trim()) return Alert.alert("Name required", "Please enter a name.");
      setSavingName(true);
      await updateName(userId!, name.trim());
      Alert.alert("Updated", "Name updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const toggleTheme = async (isDark: boolean) => {
    const next = isDark ? "dark" : "light";
    try {
      await profileApi.updateProfile(userId!, { theme: next });
      setTheme(next);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update theme");
    }
  };

  if (!userId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <AppText>Please sign in to view your profile.</AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Card elevated>
        <View style={styles.center}>
          <CloudinaryPhotoPicker value={profilePhoto} onChange={onPhotoUploaded} />
        </View>

        <View style={{ height: 20 }} />
        <AppText style={[styles.email, { color: colors.text, fontSize: 15 }]}>{userEmail}</AppText>
        <AppText muted style={{marginTop:20, marginBottom: 8, fontSize: 13 }}>Your Name</AppText>
        <AppInput placeholder="Your name" value={name} onChangeText={setName} />

        <View style={{ height: 14 }} />

        <AppButton title={savingName ? "Updating..." : "Update Name"} onPress={handleUpdateName} disabled={savingName} />

        <View style={{ height: 24 }} />

        <View style={styles.themeRow}>
          <View>
            <AppText style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>Dark Theme</AppText>
            <AppText muted style={{ fontSize: 12, marginTop: 2 }}>Switch between light and dark mode</AppText>
          </View>
          <CustomSwitch value={theme === "dark"} onValueChange={toggleTheme} />
        </View>

        <View style={{ height: 24 }} />

        <AppButton title="Sign Out" onPress={signOut} variant="ghost" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  center: {
    alignItems: "center",
    gap: 10,
  },
  email: {
    opacity: 0.9,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

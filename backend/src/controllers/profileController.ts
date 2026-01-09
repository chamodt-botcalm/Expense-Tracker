import { UserModel } from '../models/UserModel';

export async function getProfile(req: any, res: any) {
  try {
    const user = await UserModel.findById(req.params.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...profile } = user;
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function updateProfile(req: any, res: any) {
  try {
    const { name, profile_photo, theme } = req.body;
    const userId = req.params.user_id;

    const user = await UserModel.updateProfile(userId, { name, profile_photo, theme });
    const { password, ...profile } = user;

    res.status(200).json({ message: "Profile updated", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

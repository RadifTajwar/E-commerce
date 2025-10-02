// Export the function so it can be used in other files
export const uploadVideoToCloudinary = async (file, folder) => {
  const formData = new FormData();
  formData.append("file", file); // File object from input
  formData.append("upload_preset", "LeatherForLuxury"); // Replace with your preset name
  formData.append("folder", folder); // Specify the folder dynamically
  formData.append("resource_type", "video"); // Specify resource type as video

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dzmhtdw6b/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload video to Cloudinary");
    }

    const data = await response.json();

    return data.secure_url; // Return the uploaded video URL
  } catch (error) {
    throw error;
  }
};

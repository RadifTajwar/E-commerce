// Export the function so it can be used in other files
export const uploadToCloudinary = async (file, folder) => {
  const formData = new FormData();
  formData.append("file", file); // File object from input
  formData.append("upload_preset", "LeatherForLuxury"); // Replace with your preset name
  formData.append("folder", folder); // Specify the folder dynamically

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/dzmhtdw6b/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    console.log("Uploaded Image URL:", data.secure_url);
    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

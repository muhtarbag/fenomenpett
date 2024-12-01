import sharp from 'sharp';

export const convertToWebP = async (file: File): Promise<File> => {
  try {
    // Convert the File to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the image with sharp
    const processedBuffer = await sharp(buffer)
      .webp({ quality: 80 }) // 80% quality for good balance between size and quality
      .toBuffer();

    // Create a new File object with the processed image
    const processedFile = new File(
      [processedBuffer], 
      file.name.replace(/\.[^/.]+$/, "") + ".webp", 
      { type: "image/webp" }
    );

    return processedFile;
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw error;
  }
};
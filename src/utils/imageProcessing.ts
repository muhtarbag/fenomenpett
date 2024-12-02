export const optimizeImage = async (file: File): Promise<File> => {
  console.log('Optimizing image:', file.name);
  
  // Maximum dimensions
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_WIDTH) {
        height = (MAX_WIDTH * height) / width;
        width = MAX_WIDTH;
      }
      
      if (height > MAX_HEIGHT) {
        width = (MAX_HEIGHT * width) / height;
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to WebP with quality setting
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".webp",
              { type: "image/webp" }
            );
            console.log('Image optimized:', {
              originalSize: file.size,
              optimizedSize: optimizedFile.size,
              width,
              height
            });
            resolve(optimizedFile);
          } else {
            reject(new Error("Failed to optimize image"));
          }
        },
        "image/webp",
        0.85 // 85% quality - good balance between quality and file size
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for optimization"));
    };

    img.src = URL.createObjectURL(file);
  });
};

const getImageData = (img: ImageBitmap, size: number = 32): ImageData => {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.drawImage(img, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
};

const rgb2Gray = (r: number, g: number, b: number): number => {
  return Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
};

export const calculateImageHash = async (file: File): Promise<string> => {
  try {
    console.log('Starting image hash calculation for file:', file.name);
    
    const img = new Image();
    const loadImagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });

    const loadedImg = await loadImagePromise;
    const bitmap = await createImageBitmap(loadedImg);
    const imageData = getImageData(bitmap, 32); // Reduced size for consistent hashing
    const pixels: number[] = [];
    
    // Convert to grayscale
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels.push(rgb2Gray(
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2]
      ));
    }

    // Generate a simpler hash based on pixel brightness
    let hash = '';
    const average = pixels.reduce((a, b) => a + b, 0) / pixels.length;
    
    for (let i = 0; i < pixels.length; i++) {
      hash += pixels[i] > average ? '1' : '0';
    }
    
    console.log('Generated image hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error calculating image hash:', error);
    throw error;
  }
};

export const calculateHammingDistance = (hash1: string, hash2: string): number => {
  if (hash1.length !== hash2.length) {
    console.error('Hash length mismatch:', hash1.length, hash2.length);
    return Number.MAX_SAFE_INTEGER;
  }
  
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  
  console.log('Calculated Hamming distance:', distance);
  return distance;
};
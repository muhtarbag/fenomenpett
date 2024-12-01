export const convertToWebP = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".webp",
              { type: "image/webp" }
            );
            resolve(webpFile);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        },
        "image/webp",
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

const getImageData = (img: ImageBitmap, size: number = 64): ImageData => { // Increased size from 32 to 64
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.drawImage(img, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
};

const rgb2Gray = (r: number, g: number, b: number): number => {
  return Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
};

const calculateDCT = (pixels: number[]): number[] => {
  const size = Math.sqrt(pixels.length);
  const dct: number[] = new Array(pixels.length).fill(0);

  for (let u = 0; u < size; u++) {
    for (let v = 0; v < size; v++) {
      let sum = 0;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          sum += pixels[i * size + j] *
            Math.cos((2 * i + 1) * u * Math.PI / (2 * size)) *
            Math.cos((2 * j + 1) * v * Math.PI / (2 * size));
        }
      }
      dct[u * size + v] = sum;
    }
  }
  return dct;
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
    const imageData = getImageData(bitmap, 64); // Increased size for more detail
    const pixels: number[] = [];
    
    // Convert to grayscale with improved precision
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels.push(rgb2Gray(
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2]
      ));
    }

    // Calculate DCT
    const dct = calculateDCT(pixels);
    
    // Use more coefficients for the hash
    const dctValues = dct.slice(0, 256); // Increased from 64 to 256
    const median = dctValues.sort((a, b) => a - b)[128]; // Adjusted median index
    
    // Generate hash with more bits
    let hash = '';
    for (let i = 0; i < 256; i++) { // Increased from 64 to 256
      hash += dctValues[i] > median ? '1' : '0';
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
    return Number.MAX_SAFE_INTEGER; // Return max distance if hashes are different lengths
  }
  
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  
  console.log('Calculated Hamming distance:', distance);
  return distance;
};
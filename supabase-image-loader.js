const projectId = "jtfcfsnksywotlbsddqb";

export default function supabaseLoader({ src, width, quality }) {
  // For Supabase Storage images, use transformation API
  const publicPrefix = `https://${projectId}.supabase.co/storage/v1/object/public/`;

  if (!src.startsWith(publicPrefix)) {
    // For non-Supabase URLs (local files, external images, placeholders)
    // Return as-is - Next.js will handle them
    // Note: Local files with custom loaders won't be optimized,
    // so use the unoptimized prop for local images if needed
    return src;
  }

  // Extract the path after /public/
  const path = src.replace(publicPrefix, "");

  // Remove any existing query parameters (like ?t=timestamp)
  const cleanPath = path.split("?")[0];

  // Return the Supabase image transformation URL
  // Calculate height based on 3:4 aspect ratio (common for event cards)
  // This ensures images are cropped properly by Supabase to fit their containers
  const height = Math.round((width * 4) / 3);

  // Use resize=cover to crop images to exact dimensions
  // This provides the best fit for containers and requests only the needed size
  return `https://${projectId}.supabase.co/storage/v1/render/image/public/${cleanPath}?width=${width}&height=${height}&quality=${
    quality || 75
  }&resize=cover`;
}

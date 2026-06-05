import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Uploads an image File to Cloudinary (signed, server-side) and returns the
 * secure CDN URL. Only image bytes go to Cloudinary — all data (the URL, the
 * product/banner records) stays in Supabase.
 */
export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export { cloudinary }

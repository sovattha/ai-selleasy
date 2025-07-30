import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
})

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!
const bucket = storage.bucket(bucketName)

export async function uploadImage(file: File, fileName: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  const fileUpload = bucket.file(`items/${fileName}`)
  
  await fileUpload.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  })

  await fileUpload.makePublic()

  return `https://storage.googleapis.com/${bucketName}/items/${fileName}`
}
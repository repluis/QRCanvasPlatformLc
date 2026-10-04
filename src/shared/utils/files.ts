export function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function readImageFiles(files: FileList | File[]): Promise<string[]> {
  const images = [...files].filter((file) => file.type.startsWith('image/'))
  return Promise.all(images.map(readAsDataUrl))
}

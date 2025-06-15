// postFormData.ts
export const postFormData = async (
  url: string,
  formData: FormData
): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    return response.ok
  } catch (error) {
    console.error('Error uploading file:', error)
    return false
  }
}

export default (extension: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv'];

  if (!extension) {
    return false;
  }

  const fileParts = extension.split('.');
  if (fileParts.length === 0 || fileParts.length === 1) {
    return false;
  }

  const fileExtension = fileParts.pop()?.toLowerCase();
  if (!fileExtension) {
    return false;
  }

  return videoExtensions.includes(fileExtension);
};

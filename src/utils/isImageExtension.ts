export default (extension: string| undefined): boolean => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!extension) {
    return false;
  }

  const fileParts = extension.split('.');
  if (fileParts.length === 0) {
    return false;
  }

  const fileExtension = fileParts.pop()?.toLowerCase();
  if (!fileExtension) {
    return false;
  }

  return allowedExtensions.includes(fileExtension);
};

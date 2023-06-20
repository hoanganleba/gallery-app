export default (width: number, height: number, newWidth: number) => {
  const aspectRatio = width / height;
  const newHeight = Math.round(newWidth / aspectRatio);

  return {
    width: newWidth,
    height: newHeight,
  };
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString(); // customize format if needed
};

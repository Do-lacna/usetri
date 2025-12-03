/**
 * Formats discount validity dates for display
 * @param validFrom - Start date of validity (ISO string)
 * @param validTo - End date of validity (ISO string)
 * @returns Formatted validity string
 */
export const formatDiscountValidity = (
  validFrom?: string,
  validTo?: string,
): string => {
  if (!validFrom && !validTo) {
    return '';
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${day}. ${month}`;
  };

  if (validFrom && validTo) {
    return `${formatDate(validFrom)} - ${formatDate(validTo)}`;
  }

  if (validFrom) {
    return `od ${formatDate(validFrom)}`;
  }

  if (validTo) {
    return `do ${formatDate(validTo)}`;
  }

  return '';
};

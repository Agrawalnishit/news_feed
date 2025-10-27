export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text?.split(/\s+/)?.length || 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

export const shareArticle = async (article) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
      return true;
    } catch (error) {
      console.warn('Error sharing:', error);
      return false;
    }
  }
  return false;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Error copying to clipboard:', error);
    return false;
  }
};
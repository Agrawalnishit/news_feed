import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateReadingTime, shareArticle, copyToClipboard } from '../utils/helpers';

const NewsCard = ({ article, isBookmarked: propIsBookmarked = false }) => {
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarkedArticles', []);
  const [isBookmarked, setIsBookmarked] = useState(
    propIsBookmarked || bookmarks.some(bookmark => bookmark.url === article.url)
  );
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    title,
    description,
    urlToImage,
    url,
    source,
    publishedAt,
    author,
    content
  } = article;

  const readingTime = calculateReadingTime(content || description || title);

  const handleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.url !== article.url));
    } else {
      setBookmarks([...bookmarks, article]);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shared = await shareArticle(article);
    if (!shared) {
      setShowShareMenu(true);
    }
  };

  const handleCopyLink = async () => {
    const copied = await copyToClipboard(url);
    if (copied) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const defaultImage = 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=No+Image+Available';

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                       hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                       flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={urlToImage || defaultImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {source.name}
          </span>
        </div>
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-all duration-200 ${
              isBookmarked 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200"
              aria-label="Share article"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    {copySuccess ? (
                      <span className="text-green-600">✓ Copied!</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {description || 'No description available.'}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {author || 'Unknown'}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(publishedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {readingTime} min read
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              {source.name}
            </span>
          </div>
        </div>

        {/* Read More Button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white font-medium py-2 px-4 rounded-lg
                   hover:from-blue-700 hover:to-purple-700
                   transition-all duration-200"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;

import React from 'react';

interface KofiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KofiModal: React.FC<KofiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
      >
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white transition hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe 
          id='kofiframe' 
          src='https://ko-fi.com/pixelfan/?hidefeed=true&widget=true&embed=true&preview=true' 
          className='border-none w-full h-[712px] bg-[#f9f9f9] p-1'
          title='pixelfan'
        ></iframe>
        <div className="text-center py-2">
          <a href="https://ko-fi.com/pixelfan" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-500">
            Visit my Ko-fi page
          </a>
        </div>
      </div>
    </div>
  );
};

export default KofiModal;
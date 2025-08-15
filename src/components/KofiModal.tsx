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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
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
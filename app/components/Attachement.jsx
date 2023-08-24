import React from 'react'
import Trash from './icons/Trash';
import { PeperClip } from './icons/PaperClip';

const Attachement = ({ link, showRemoveButton = false, handleFileRemove }) => {
  return (
    <a href={link} target="_blank" className="h-16 relative">
      {showRemoveButton && (
        <button
          type="button"
          onClick={(e) => handleFileRemove(e, link)}
          className="absolute right-1 top-1 p-1 bg-red-500 rounded-full shadow-md"
        >
          <Trash className="w-5 h-5 text-white" />
        </button>
      )}

      {/.(jpg|png|jpeg)$/.test(link) ? (
        <img src={link} className="h-16 w-auto rounded-md" alt="" />
      ) : (
        <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
          <PeperClip className="w-4 h-4 text-blue-600" />
          {link.split("/")[3].substring(13)}
        </div>
      )}
    </a>
  );
};

export default Attachement
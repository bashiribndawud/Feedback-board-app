import React, { useState } from 'react'
import Loader from './Loader';
import axios from 'axios';

const AttachFileButton = ({onNewFiles}) => {
    const [isUploading, setisUploading] = useState(false)
    async function handleAttachFileInputChange(evt) {
      evt.stopPropagation();
      const files = [...evt.target.files];
      setisUploading(true);
      if (files?.length > 0) {
        const dataForm = new FormData();
        for (const file of files) {
          dataForm.append("file", file);
        }

        const res = await axios.post("/api/upload", dataForm);
        onNewFiles(res.data);
        setisUploading(false);
      }
    }
  return (
    <label
      htmlFor="file"
      className="py-2 p-x4 text-gray-600 cursor-pointer flex gap-2 items-center"
    >
      {isUploading && <Loader />}
      <span className={isUploading ? "text-gray-300" : "text-gray-600"}>
        {isUploading ? "Uploading..." : "Attach File"}
      </span>
      <input
        className="hidden"
        type="file"
        name="files"
        id="file"
        onChange={handleAttachFileInputChange}
        multiple
      />
    </label>
  );
}

export default AttachFileButton
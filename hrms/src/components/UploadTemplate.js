import React, { useState } from 'react';
import api from "../api";


function UploadTemplate() {
  const [templateName, setTemplateName] = useState('');
  const [templateFile, setTemplateFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('template_name', templateName);
    formData.append('file', templateFile);

    // Debug: Log FormData content
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await api.post('/api/templates/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Template Name"
        value={templateName}
        onChange={(e) => {
            console.log('Template Name:', e.target.value); // Debug input value
            setTemplateName(e.target.value);
        }}
      />
      <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
              console.log('Selected File:', e.target.files[0]); // Debug selected file
              setTemplateFile(e.target.files[0]);
          }}
      />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadTemplate;

import React, { useState, useEffect } from 'react';
import api from "../api";

function GenerateLetter() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [values, setValues] = useState({});
  const [generatedLetterUrl, setGeneratedLetterUrl] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await api.get('/api/templates/');
      setTemplates(response.data);
    };
    fetchTemplates();
  }, []);

  const handleTemplateSelect = async (id) => {
    setSelectedTemplateId(id);
    const response = await api.get(`/api/templates/${id}/placeholders/`);
    setPlaceholders(response.data.placeholders);
    setValues({});
  };

  const handleGenerate = async () => {
    const response = await api.post('/api/templates/generate/', {
      template_id: selectedTemplateId,
      placeholders: values,
    }, { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    setGeneratedLetterUrl(url);
  };

  return (
    <div>
      <h1>Generate Letter</h1>
      <select onChange={(e) => handleTemplateSelect(e.target.value)}>
        <option>Select a Template</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.template_name}
          </option>
        ))}
      </select>
      {placeholders.length > 0 && (
        <div>
          <h2>Fill Details</h2>
          {placeholders.map((placeholder) => (
            <div key={placeholder}>
              <label>{placeholder}</label>
              <input
                type="text"
                onChange={(e) =>
                  setValues({ ...values, [placeholder]: e.target.value })
                }
              />
            </div>
          ))}
          <button onClick={handleGenerate}>Generate Letter</button>
        </div>
      )}
      {generatedLetterUrl && (
        <div>
          <h2>Generated Letter</h2>
          <a href={generatedLetterUrl} download="generated_letter.pdf">
            Download Letter
          </a>
        </div>
      )}
    </div>
  );
}

export default GenerateLetter;

// import React, { useState } from 'react';
// import api from "../api";
// import Navbar from '../pages/Navbar';
// import '../styles/BiometricAttd.css';

// const BiometricAttd = () => {
//     const [file, setFile] = useState(null);
//     const [message, setMessage] = useState('');
//     const [downloadUrl, setDownloadUrl] = useState(null); 
//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
//     const handleUpload = async () => {
//         if (!file) {
//             setMessage('Please select a file first!');
//             return;
//         }
//         const formData = new FormData();
//         formData.append('file', file);
//         try {
//             const response = await api.post('/api/upload-attendance/', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setMessage(response.data.message || 'File uploaded successfully!');
//             if (response.data.downloadUrl) {
//                 setDownloadUrl(response.data.downloadUrl); 
//             } else {
//                 setMessage('File uploaded, but no processed file available for download.');
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.error || 'File upload failed!');
//         }
//     };

//     return (
//         <div>
//         <Navbar />
//         <div className='biometric-container'>
//             <h2>Upload Biometric Attendance File</h2>
//             <input type="file" onChange={handleFileChange} />
//             <button onClick={handleUpload}>Upload</button>
//             {message && <p>{message}</p>}
//             {downloadUrl && (
//                 <div>
//                     <p>Download your processed file below:</p>
//                     <a href={downloadUrl} download="Processed_Attendance_File.xlsx">
//                         Download Processed File
//                     </a>
//                 </div>
//             )}
//         </div>
//         </div>
//     );
// };

// export default BiometricAttd;


import React, { useState } from 'react';
import api from "../api";
import Navbar from '../pages/Navbar';
import '../styles/BiometricAttd.css';

const BiometricAttd = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null); 

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/upload-attendance/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage(response.data.message || 'File uploaded successfully!');

            if (response.data.downloadUrl) {
                setDownloadUrl(response.data.downloadUrl); 
            } else {
                setMessage('File uploaded, but no processed file available for download.');
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'File upload failed!');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="biometric-container">
                <h2>Upload Biometric Attendance File</h2>
                <input type="file" onChange={handleFileChange} className='fileupload-button'/>
                <div className="button-wrapper">
                    <button onClick={handleUpload}>Upload</button>
                </div>
                {message && <p>{message}</p>}
                {downloadUrl && (
                    <div>
                        <p>Download your processed file below:</p>
                        <a href={downloadUrl} download="Processed_Attendance_File.xlsx">
                            Download Processed File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BiometricAttd;

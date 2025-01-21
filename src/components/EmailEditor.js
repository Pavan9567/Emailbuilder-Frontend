import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailEditor = () => {
    const [layout, setLayout] = useState('');
    const [fields, setFields] = useState({ title: '', content: '', footer: '', imageUrl: '' });

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/getEmailLayout/`)
            .then(response => setLayout(response.data.layout));
    }, []);

    const handleInputChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`${process.env.REACT_APP_API_URL}/uploadImage/`, formData)
            .then(response => setFields({ ...fields, imageUrl: response.data.url }));
    };

    const saveTemplate = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/uploadEmailConfig/`, fields)
            .then(response => alert(`Template saved with ID: ${response.data.id}`));
    };

    const renderTemplate = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/renderAndDownloadTemplate/`, fields)
            .then(response => console.log(response.data.rendered_html));
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Builder</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div dangerouslySetInnerHTML={{ __html: layout }} />
                <div className="flex flex-col gap-4">
                    <input className="border p-2 rounded" name="title" placeholder="Title" onChange={handleInputChange}/>
                    <textarea className="border p-2 rounded" name="content" placeholder="Content" onChange={handleInputChange} />
                    <input className="border p-2 rounded" name="footer" placeholder="Footer" onChange={handleInputChange}/>
                    <input type="file" className="border p-2" onChange={handleFileUpload} />
                    <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveTemplate}>Save Template</button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={renderTemplate}>Render & Download</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailEditor;

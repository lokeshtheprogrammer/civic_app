import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';

const SubmitIssue = () => {
    const { addIssue } = useIssues();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Roads');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ["Roads", "Electricity", "Sanitation", "Water", "Public Works"];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const newIssueData = {
            title,
            description,
            category,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address: 'User Submitted Location' // Placeholder address
            },
            priority: 'Medium',
            imageFile,
        };

        try {
            await addIssue(newIssueData);
            navigate('/');
        } catch (err) {
            setError('Failed to submit issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 p-8 lg:p-10">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Submit a New Issue</h1>
                <p className="text-lg text-gray-500 mt-2">Fill out the form below to report a civic issue in your area.</p>
            </header>

            <section className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center py-2">{error}</p>}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Large Pothole on Main Street"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide a detailed description of the issue."
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Image preview" className="w-full max-w-xs rounded-lg shadow-md" />
                        </div>
                    )}


                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                                Latitude
                            </label>
                            <input
                                type="text"
                                id="lat"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 12.9716"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                                Longitude
                            </label>
                            <input
                                type="text"
                                id="lng"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 77.5946"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400"
                        >
                            {loading ? 'Submitting...' : 'Submit Issue'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default SubmitIssue;

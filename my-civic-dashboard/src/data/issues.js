
export const MOCK_ISSUES = [
    {
        id: '1',
        title: 'Large Pothole on Main Street',
        description: 'A large pothole has developed near the intersection of Main Street and Oak Avenue, causing traffic hazards.',
        category: 'Roads',
        status: 'Submitted',
        priority: 'High',
        location: { lat: 12.9716, lng: 77.5946, address: 'Main St, Bengaluru' }, // Bengaluru coords
        reportedBy: 'Citizen A',
        reportedAt: '2025-08-20T10:30:00Z',
        imageUrl: 'https://placehold.co/400x250/F87171/FFFFFF?text=Pothole',
    },
    {
        id: '2',
        title: 'Streetlight out on Park Avenue',
        description: 'The streetlight outside 123 Park Avenue has been out for three nights.',
        category: 'Electricity',
        status: 'Assigned',
        priority: 'Medium',
        location: { lat: 13.0827, lng: 80.2707, address: 'Park Ave, Chennai' }, // Chennai coords
        reportedBy: 'Citizen B',
        reportedAt: '2025-08-19T14:15:00Z',
        imageUrl: 'https://placehold.co/400x250/60A5FA/FFFFFF?text=Streetlight',
    },
    {
        id: '3',
        title: 'Overflowing Public Dustbin',
        description: 'The public dustbin near the bus stop on Gandhi Road is overflowing and creating a mess.',
        category: 'Sanitation',
        status: 'Resolved',
        priority: 'Medium',
        location: { lat: 17.3850, lng: 78.4867, address: 'Gandhi Rd, Hyderabad' }, // Hyderabad coords
        reportedBy: 'Citizen C',
        reportedAt: '2025-08-18T08:00:00Z',
        imageUrl: 'https://placehold.co/400x250/34D399/FFFFFF?text=Dustbin',
    },
    {
        id: '4',
        title: 'Water Leakage near Market Area',
        description: 'Continuous water leakage from a pipe near the entrance of the main market. Wasting water and creating slippery conditions.',
        category: 'Water',
        status: 'Submitted',
        priority: 'High',
        location: { lat: 19.0760, lng: 72.8777, address: 'Market Area, Mumbai' }, // Mumbai coords
        reportedBy: 'Citizen D',
        reportedAt: '2025-08-21T09:00:00Z',
        imageUrl: 'https://placehold.co/400x250/FBBF24/FFFFFF?text=Water+Leak',
    },
    {
        id: '5',
        title: 'Graffiti on Underpass Wall',
        description: 'New graffiti found on the underpass wall near the train station. Needs cleaning.',
        category: 'Public Works',
        status: 'Submitted',
        priority: 'Low',
        location: { lat: 28.7041, lng: 77.1025, address: 'Train Station Underpass, Delhi' }, // Delhi coords
        reportedBy: 'Citizen E',
        reportedAt: '2025-08-22T11:00:00Z',
        imageUrl: 'https://placehold.co/400x250/A78BFA/FFFFFF?text=Graffiti',
    },
];

import type { NextApiRequest, NextApiResponse } from 'next';
import { IBlogCategoryResponse } from '../../shared/lib/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IBlogCategoryResponse>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            results: [], 
            meta: { page: 1, pageSize: 25, pageCount: 1, total: 0 } 
        });
    }

    try {
        // Mock blog categories data
        const categories = [
            { id: 1, name: 'All topics' },
            { id: 2, name: 'Announcements' },
            { id: 3, name: 'Engineering' },
            { id: 4, name: 'Research' },
            { id: 5, name: 'Community' },
            { id: 6, name: 'Chat Lab' },
            { id: 7, name: 'Partnerships' },
        ];

        const response: IBlogCategoryResponse = {
            results: categories,
            meta: {
                page: 1,
                pageSize: 25,
                pageCount: 1,
                total: categories.length,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Blog categories API error:', error);
        res.status(500).json({ 
            results: [], 
            meta: { page: 1, pageSize: 25, pageCount: 1, total: 0 } 
        });
    }
}


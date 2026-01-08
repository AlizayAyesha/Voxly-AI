import type { NextApiRequest, NextApiResponse } from 'next';
import { IServerResponse } from '../../shared/lib/types/global';

interface IProjectCategory {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    projects?: {
        count: number;
    }
}

type IProjectCategoriesResponse = IServerResponse<IProjectCategory>;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IProjectCategoriesResponse>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            results: [], 
            meta: { page: 1, pageSize: 25, pageCount: 1, total: 0 } 
        });
    }

    try {
        // Mock ecosystem categories data
        const categories = [
            { 
                id: 1, 
                name: 'All', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 0 }
            },
            { 
                id: 2, 
                name: 'Bridge', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 5 }
            },
            { 
                id: 3, 
                name: 'DeFi', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 12 }
            },
            { 
                id: 4, 
                name: 'NFT', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 3 }
            },
            { 
                id: 5, 
                name: 'GameFi', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 4 }
            },
            { 
                id: 6, 
                name: 'DAO', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 2 }
            },
            { 
                id: 7, 
                name: 'Infrastructure', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 8 }
            },
            { 
                id: 8, 
                name: 'Tooling', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                projects: { count: 6 }
            },
        ];

        const response: IProjectCategoriesResponse = {
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
        console.error('Ecosystem categories API error:', error);
        res.status(500).json({ 
            results: [], 
            meta: { page: 1, pageSize: 25, pageCount: 1, total: 0 } 
        });
    }
}


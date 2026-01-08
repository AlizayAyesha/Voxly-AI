import { IBlogCategoryResponse } from '../types';
import { instance } from '../utils/instance';

export const blogCategoryApi = {
    async getAll() {
        const { data } = await instance<IBlogCategoryResponse>('/api/blog-categories');
        return data;
    },
};

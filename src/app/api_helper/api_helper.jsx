import axios from "axios";

const api_base_url = process.env.NEXT_PUBLIC_API_BASE;

export const post_api = async ({ body, params, path }) => {
    try {

        const url = params
            ? `${api_base_url}/${path}/${params}`
            : `${api_base_url}/${path}`;

        const response = await axios.post(url, body, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const get_api = async ({ params, path }) => {
    try {

        const url = params
            ? `${api_base_url}/${path}/${params}`
            : `${api_base_url}/${path}`;

        const response = await axios.get(url, {} , {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
import axios from "axios";

const request = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    params:{
        api_key: "b702aecf80ecfea3fa9f2532be117d59",
        language: "ko-KR"
    }
});

export const movieApi = {
    nowPlaying: () => request.get("/movie/now_playing"),
    popular: () => request.get("/movie/popular"),
    upComing: () => request.get("/movie/upcoming"),
    movieDetail: (id) => 
        request.get(`/movie/${id}`, {
            params: {append_to_response: "videos"},
        }),
    search: (keyword) => 
        request.get("/search/movie", {
            parmas: {
                query: keyword,
            },
        }),
}
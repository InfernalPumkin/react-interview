import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    initMovies: (state, action) => {
      state.movies = action.payload;
    },
    deleteMovie: (state, action) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
    },
    likeMovie: (state, action) => {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        movie.likes += 1;
      }
    },
    unlikeMovie: (state, action) => {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        movie.likes -= 1;
      }
    },
    dislikeMovie: (state, action) => {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        movie.dislikes += 1;
      }
    },
    undislikeMovie: (state, action) => {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        movie.dislikes -= 1;
      }
    },
  },
});

export const { initMovies, deleteMovie, likeMovie,
               unlikeMovie, dislikeMovie, undislikeMovie } = moviesSlice.actions;
export default moviesSlice.reducer;

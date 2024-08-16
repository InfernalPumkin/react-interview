import { movies$ } from "../movies";
import { initMovies } from './reducer';

export const fetchMovies = () => async (dispatch) => {
  const movies = await movies$;
  dispatch(initMovies(movies));
};

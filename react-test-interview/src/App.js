import './App.css';
import React, { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likeMovie, unlikeMovie,
         dislikeMovie, undislikeMovie, deleteMovie } from './redux/reducer';
import { fetchMovies } from './redux/action';

function App() {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [clickedButton, setClickedButton] = useState('12 pages');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(12);
  const [userLikes, setUserLikes] = useState({});
  const [userDislikes, setUserDislikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoryRef = useRef(null);
  const buttonRef = useRef(null);
  const movies = useSelector(state => state.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize movies
    dispatch(fetchMovies());
  }, [dispatch]);


  useEffect(() => {
    // Fetch movies and set categories
      const uniqueCategories = [...new Set(movies.map(movie => movie.category))];
      setCategories(uniqueCategories);
    
    // Close the categories list when clicking outside
    const handleClickOutside = (event) => {
      if (
        categoryRef.current && buttonRef.current &&
        !categoryRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
    };

    if (categoryRef.current && buttonRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (categoryRef.current && buttonRef.current) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [movies, showCategories]);

  // Like or dislike a movie
  const handleLike = (movieId) => {
    if (userLikes[movieId]) {
      dispatch(unlikeMovie(movieId));
      setUserLikes({ ...userLikes, [movieId]: false });
    } else {
      dispatch(likeMovie(movieId));
      setUserLikes({ ...userLikes, [movieId]: true });
      if (userDislikes[movieId]) {
        dispatch(undislikeMovie(movieId));
        setUserDislikes({ ...userDislikes, [movieId]: false });
      }
    }
  };

  const handleDislike = (movieId) => {
    if (userDislikes[movieId]) {
      dispatch(undislikeMovie(movieId));
      setUserDislikes({ ...userDislikes, [movieId]: false });
    } else {
      dispatch(dislikeMovie(movieId));
      setUserDislikes({ ...userDislikes, [movieId]: true });
      if (userLikes[movieId]) {
        dispatch(unlikeMovie(movieId));
        setUserLikes({ ...userLikes, [movieId]: false });
      }
    }
  };

  
  //Show or hide categories
  const toggleCategories = () => {
    setShowCategories(prevShowCategories => !prevShowCategories);
  };
  
  // Calculate the percentage of likes and dislikes
  const calculatePercentage = (likes, dislikes) => {
    const total = likes + dislikes;
    return {
      likesPercentage: (likes / total) * 100,
      dislikesPercentage: (dislikes / total) * 100,
    };
  };
  
  const handlePageClick = (button) => {
    setClickedButton(button);
    setMoviesPerPage(parseInt(button.split(' ')[0]));
    setCurrentPage(1);
  };

  const handlePrevClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredMovies.length / moviesPerPage)));
  };

  //Choose category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  
  const filteredMovies = selectedCategory
    ? movies.filter(movie => movie.category === selectedCategory)
    : movies;

  // Pagination
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);
  
  return (
    <div className="App">
      <header className='App-header'>
        <div className='filtre-container'>
          <button onClick={toggleCategories} className='filtre' ref={buttonRef}>
            Filtres
          </button>
          {showCategories && (
            <ul className='category-list' ref={categoryRef}>
              <button key="tout" className='category-button' onClick={() => handleCategoryClick(null)}>
                Tout
              </button>
              {categories.map(category => (
                <button key={category} className='category-button' onClick={() => handleCategoryClick(category)}>
                  {category}
                </button>
              ))}
            </ul>
          )}
        </div>
        <div className='container'>
          {currentMovies.map(movie => {
            const { likesPercentage, dislikesPercentage } = calculatePercentage(movie.likes, movie.dislikes);
            return (
              <div className='card' key={movie.id}>
                <div className='title'>
                  {movie.title}
                </div>
                Catégories : {movie.category}
                <div className='like-dislike-count'>
                  <button 
                    className={`like-button ${userLikes[movie.id] ? 'active' : ''}`} 
                    onClick={() => handleLike(movie.id)}>
                    Likes : {movie.likes}
                  </button>
                  <button 
                    className={`dislike-button ${userDislikes[movie.id] ? 'active' : ''}`} 
                    onClick={() => handleDislike(movie.id)}>
                    Disikes : {movie.dislikes}
                  </button>
                </div>
                <div className='progress-bar'>
                  <div className='likes-bar' style={{ width: `${likesPercentage}%` }}></div>
                  <div className='dislikes-bar' style={{ width: `${dislikesPercentage}%` }}></div>
                </div>
                <button className='red-button' onClick={() => dispatch(deleteMovie(movie.id))}>
                  Supprimer
                </button>
              </div>
            );
          })}
        </div>
        <div className='pagination'>
          <button className='page-number' onClick={handlePrevClick} disabled={currentPage === 1}>
            Préc.
          </button>
          <button 
            className='page-number' 
            onClick={() => handlePageClick('4 pages')} 
            disabled={clickedButton === '4 pages'}
          >
            4 pages
          </button>
          <button 
            className='page-number' 
            onClick={() => handlePageClick('8 pages')} 
            disabled={clickedButton === '8 pages'}
          >
            8 pages
          </button>
          <button 
            className='page-number' 
            onClick={() => handlePageClick('12 pages')} 
            disabled={clickedButton === '12 pages'}
          >
            12 pages
          </button>
          <button className='page-number' onClick={handleNextClick} disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}>
            Suiv.
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;

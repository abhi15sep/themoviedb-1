import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchProvider } from '../../contexts/search';
import SearchResults from './index';

const mockMovies = [
  {
    id: 419704,
    title: 'Ad Astra',
    vote_average: 8,
    release_date: '2019-09-17',
    poster_path: '/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg',
    overview: 'The near future, a time when both hope and hardships drive humanity to look to the stars and beyond. While a mysterious phenomenon menaces to destroy life on planet Earth, astronaut Roy McBride undertakes a mission across the immensity of space and its many perils to uncover the truth about a lost expedition that decades before boldly faced emptiness and silence in search of the unknown.',
  },
  {
    id: 443791,
    title: 'Underwater',
    vote_average: 6.4,
    release_date: '2020-01-08',
    poster_path: '/gzlbb3yeVISpQ3REd3Ga1scWGTU.jpg',
    overview: 'After an earthquake destroys their underwater station, six researchers must navigate two miles along the dangerous, unknown depths of the ocean floor to make it to safety in a race against time.',
  },
];

/**
 * Get the node to test
 *
 * @param {object} options - the options
 * @param {boolean} options.error - the error flag
 * @param {boolean} options.loading - the loading flag
 * @param {Array<object>} options.movies - the movies
 * @param {Function} options.handleResetSearch - the handler when the user resets the search
 * @returns {SearchResults} - The node to test
 */
function getNode(options) {
  const {
    error = false,
    loading = false,
    movies,
    handleResetSearch,
  } = options;

  return (
    <Router>
      <SearchProvider
        value={{
          error,
          movies,
          loading,
          handleResetSearch,
        }}
      >
        <SearchResults />
      </SearchProvider>
    </Router>
  );
}

test('renders the links of the movies', () => {
  const { getByText } = render(getNode({
    error: false,
    loading: false,
    movies: mockMovies,
    handleResetSearch: () => {},
  }));

  const title1 = getByText('Ad Astra');
  const title2 = getByText('Underwater');

  const link1 = title1.closest('a');
  const link2 = title2.closest('a');

  expect(link1.href).toBe('http://localhost/details/419704');
  expect(link2.href).toBe('http://localhost/details/443791');
});

test('renders the titles of the movies', () => {
  const { getByText } = render(getNode({
    error: false,
    loading: false,
    movies: mockMovies,
    handleResetSearch: () => {},
  }));
  const title1 = getByText('Ad Astra');
  const title2 = getByText('Underwater');

  expect(title1).toBeInTheDocument();
  expect(title2).toBeInTheDocument();
});

test('renders the release dates of the movies', () => {
  const { getByText } = render(getNode({
    error: false,
    loading: false,
    movies: mockMovies,
    handleResetSearch: () => {},
  }));
  const releaseDate1 = getByText('(2020)');
  const releaseDate2 = getByText('(2019)');

  expect(releaseDate1).toBeInTheDocument();
  expect(releaseDate2).toBeInTheDocument();
});

test('renders the loading message', () => {
  const { getByText } = render(getNode({
    error: false,
    loading: true,
    movies: {},
    handleResetSearch: () => {},
  }));
  const message = getByText('Loading movies...');

  expect(message).toBeInTheDocument();
});

test('renders the error message', () => {
  const { getByText } = render(getNode({
    error: true,
    loading: false,
    movies: {},
    handleResetSearch: () => {},
  }));
  const message = getByText('Ups! We found an error. Try again in a few minutes.');

  expect(message).toBeInTheDocument();
});

test('On selected a movie the handler is called', () => {
  const handler = jest.fn();
  const { getByText } = render(getNode({
    error: false,
    loading: false,
    movies: mockMovies,
    handleResetSearch: handler,
  }));

  fireEvent.click(getByText('Ad Astra'));

  expect(handler).toHaveBeenCalled();
});

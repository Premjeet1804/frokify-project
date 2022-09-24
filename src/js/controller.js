import * as nodel from './model.js';
import { MODULE_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg';//parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODULE_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 update results vies to mark selected search result
    resultsView.update(nodel.getSearchResultsPage());
    // Updating bookmarks view
    bookmarksView.update(nodel.state.bookmarks);

    //Loading recipe
    await nodel.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(nodel.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)   load search results
    await nodel.loadSearchResults(query);

    //3) Render Results
    // console.log(nodel.getSearchResultsPage(1));

    // resultsView.render(nodel.state.search.results);
    resultsView.render(nodel.getSearchResultsPage());

    // 4) Render Initial pagination buttons
    paginationView.render(nodel.state.search);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const controlPagination = function (goToPage) {
  //3) Render Results

  // render NEW results
  resultsView.render(nodel.getSearchResultsPage(goToPage));

  // render NEW pagination buttons
  paginationView.render(nodel.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings
  nodel.updateServings(newServings);

  //update the recipe view
  // recipeView.render(nodel.state.recipe);
  recipeView.update(nodel.state.recipe);
};

const controlAddBookmark = function () {
  // 1 add or remove bookmark
  if (!nodel.state.recipe.bookmarked) nodel.addBookmark(nodel.state.recipe);
  else nodel.deleteBookmark(nodel.state.recipe.id);

  //2) Update recipe view
  recipeView.update(nodel.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(nodel.state.bookmarks);
};

const constrolBookmarks = function () {
  bookmarksView.render(nodel.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await nodel.uploadRecipe(newRecipe);
    console.log(nodel.state.recipe);

    //Render recipe
    recipeView.render(nodel.state.recipe);

    //sucess message
    addRecipeView.renderMessage();

    //Render recipe
    bookmarksView.render(nodel.state.bookmarks);

    //Change in URL
    window.history.pushState(null, '', `#${nodel.state.recipe.id}`);

    //Close from window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODULE_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('*', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(constrolBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  console.log('welcome !');
};
init();

import './index.css'

const FiltersGroup = props => {
  const {
    searchInput,
    activeRatingId,
    categoryOptions,
    ratingsList,
    changeCategoryby,
    changeRatingby,
    changeSearchInput,
    onSearch,
    clearFilters,
  } = props

  return (
    <div className="filters-group-container">
      <div>
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          aria-label="Search products"
          value={searchInput}
          onChange={changeSearchInput}
          onKeyDown={onSearch}
        />
        <div className="filters-panel">
          <p className="filter-heading">Category</p>
          {categoryOptions.map(each => (
            <button
              key={each.categoryId}
              type="button"
              onClick={() => changeCategoryby(each.categoryId)}
            >
              {each.name}
            </button>
          ))}
          <p className="filter-heading">Rating</p>
          {ratingsList.map(each => (
            <button
              key={each.ratingId}
              type="button"
              className={
                activeRatingId === each.ratingId
                  ? 'rating-option active'
                  : 'rating-option'
              }
              title={`${each.ratingId} stars & above`}
              aria-label={`${each.ratingId} stars and above`}
              onClick={() => changeRatingby(each.ratingId)}
            >
              <img src={each.imageUrl} alt={`rating ${each.ratingId}`} />
            </button>
          ))}
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersGroup

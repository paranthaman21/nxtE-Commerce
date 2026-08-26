import './index.css'

const FiltersGroup = props => {
  const {
    searchInput,
    categoryOptions,
    ratingsList,
    changeCategoryby,
    changeRatingby,
    changeSearchInput,
    onSearch,
  } = props

  return (
    <div className="filters-group-container">
      <div>
        <input
          type="search"
          value={searchInput}
          onChange={changeSearchInput}
          onKeyDown={onSearch}
        />
        <div>
          <p>Category</p>
          {categoryOptions.map(each => (
            <button
              key={each.categoryId}
              type="button"
              onClick={() => changeCategoryby(each.categoryId)}
            >
              {each.name}
            </button>
          ))}
          <p>Rating</p>
          {ratingsList.map(each => (
            <button
              key={each.ratingId}
              type="button"
              onClick={() => changeRatingby(each.ratingId)}
            >
              <img src={each.imageUrl} alt={`rating ${each.ratingId}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FiltersGroup

// This is the root component for #search-page

import React from 'react';
import axios from 'axios'
import SearchForm from './SearchPage/SearchForm';
import SearchResult from './SearchPage/SearchResult';

export default class SearchPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      location: location,
      searchingKeyword: this.props.query.q || '',
      searchedPages: [],
      searchError: null,
    }

    this.search = this.search.bind(this);
    this.changeURL = this.changeURL.bind(this);
  }

  componentDidMount() {
    if (this.state.searchingKeyword !== '')  {
      this.search({keyword: this.state.searchingKeyword});
      this.setState({searchedKeyword: this.state.keyword});
    }
  }

  static getQueryByLocation(location) {
    let search = location.search || '';
    let query = {};

    search.replace(/^\?/, '').split('&').forEach(function(element) {
      let queryParts = element.split('=');
      query[queryParts[0]] = decodeURIComponent(queryParts[1]).replace(/\+/g, ' ');
    });

    return query;
  }

  changeURL(keyword) {
    if (window.history && window.history.pushState ){
      window.history.pushState(state, 'hoge', 'x');
    }
  }

  search(data) {
    const keyword = data.keyword;
    if (keyword === '') {
      this.setState({
        searchingKeyword: '',
        searchedPages: [],
      });

      return true;
    }

    this.setState({
      searchingKeyword: keyword,
    });

    axios.get('/_api/search', {params: {q: keyword}})
    .then((res) => {
      if (res.data.ok) {
        this.setState({
          searchingKeyword: keyword,
          searchedPages: res.data.data,
        });
      }

      this.changeURL(keyword);
      // TODO error
    })
    .catch((res) => {
      // TODO error
    });
  };

  render() {
    return (
      <div>
        <div className="header-wrap">
          <header>
            <SearchForm
              onSearchFormChanged={this.search}
              keyword={this.state.searchingKeyword}
              />
          </header>
        </div>

        <SearchResult
          pages={this.state.searchedPages}
          searchingKeyword={this.state.searchingKeyword}
          />
      </div>
    );
  }
}

SearchPage.propTypes = {
  query: React.PropTypes.object,
};
SearchPage.defaultProps = {
  //pollInterval: 1000,
  query: SearchPage.getQueryByLocation(location || {}),
};

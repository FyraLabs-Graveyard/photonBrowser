import { SearchRendererEvents } from "./../../../utils/constants";
import { makeObservable, observable, action } from "mobx";
import { Result } from "@getskye/suggest";
import { createContext, useContext } from "react";
import { DuckDuckGo, RootObject } from "@getskye/suggest/dist/engines/ddg";
class SearchStore {
  public query: string = "";
  public searchEngineSuggestions: Result = [];
  public instantAnswer?: RootObject = undefined;
  public loading: boolean = true;

  constructor() {
    makeObservable(this, {
      query: observable,
      loading: observable,
      instantAnswer: observable,
      searchEngineSuggestions: observable,
      updateQuery: action,
      updateSearchEngineSuggestions: action,
    });

    window.skye.on(
      SearchRendererEvents.SEARCH_QUERY_UPDATED,
      (query: string, ddg: DuckDuckGo) => {
        this.updateQuery(query);
        this.updateInstantAnswer(ddg.instantAnswer);
        this.updateSearchEngineSuggestions(ddg.suggestions);
        this.stopLoading();
      }
    );
  }

  updateQuery(query: string) {
    this.query = query;
  }

  updateInstantAnswer(instantAnswer: RootObject) {
    this.instantAnswer = instantAnswer;
  }

  stopLoading() {
    this.loading = false;
  }

  updateSearchEngineSuggestions(suggestions: Result) {
    this.searchEngineSuggestions = suggestions;
  }
}

export const SearchContext = createContext<SearchStore>(new SearchStore());
export const useSearch = () => useContext(SearchContext);

export default SearchStore;

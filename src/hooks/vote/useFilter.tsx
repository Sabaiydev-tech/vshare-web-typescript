import React, { useMemo } from "react";

const initialState = {
  pageRow: null,
  status: null,
  pageLimit: 10,
  currentPageNumber: 1,
  search: null,
  select: "score_DESC",
  startDate: null,
  endDate: null,
};

const ACTION_TYPE = {
  PAGE_LIMIT: "limit",
  STATUS: "status",
  PAGE_ROW: "page_row",
  PAGINATION: "pagination",
  SEARCH: "search",
  SELECT: "select",
  START_DATE: "start_date",
  END_DATE: "end_date",
};

const reducer = (state: any, action: any) => {
  
  switch (action.type) {
    case ACTION_TYPE.PAGE_LIMIT:
      return { ...state, pageLimit: action.payload || null };
    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, currentPageNumber: 1 };
    case ACTION_TYPE.PAGE_ROW:
      return {
        ...state,
        pageRow: action.payload || null,
        ...(action.payload && {
          pageLimit: action.payload,
        }),
        currentPageNumber: 1,
      };
    case ACTION_TYPE.PAGINATION:
      return {
        ...state,
        currentPageNumber: action.payload || null,
      };
    case ACTION_TYPE.SEARCH:
      return {
        ...state,
        search: action.payload || null,
      };
    case ACTION_TYPE.SELECT:
      return {
        ...state,
        select: action.payload || null,
      };
    case ACTION_TYPE.START_DATE:
      return {
        ...state,
        startDate: action.payload || null,
      };
    case ACTION_TYPE.END_DATE:
      return {
        ...state,
        endDate: action.payload || null,
      };
    default:
      return;
  }
};

const useFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const data = useMemo(() => {
    return { ...state };
  }, [state]);
  return { state, data, dispatch, ACTION_TYPE };
};

export default useFilter;

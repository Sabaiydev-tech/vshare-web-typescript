import React, { useMemo } from "react";

const initialState = {
  status: null,
  pageLimit: 10,
  page: 0,
  search: null,
  select: "createdAt_DESC",
  startDate: null,
  endDate: null,
  offset: 3,
};

const ACTION_TYPE = {
  PAGE_LIMIT: "pageLimit",
  STATUS: "status",
  PAGE: "page",
  SEARCH: "search",
  SELECT: "select",
  START_DATE: "start_date",
  END_DATE: "end_date",
  LIMIT: "offset",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTION_TYPE.PAGE_LIMIT:
      return { ...state, pageLimit: action.payload || 3 };
    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, page: 0 };

    case ACTION_TYPE.PAGE:
      return {
        ...state,
        page: action.payload || 0,
      };
    case ACTION_TYPE.SEARCH:
      return {
        ...state,
        search: action.payload || null,
      };
    case ACTION_TYPE.SELECT:
      return {
        ...state,
        startDate: null,
        endDate: null,
        page: 0,
        select: action.payload || null,
      };
    case ACTION_TYPE.START_DATE:
      return {
        ...state,
        page: 0,
        startDate: action.payload || null,
      };
    case ACTION_TYPE.END_DATE:
      return {
        ...state,
        page: 0,
        endDate: action.payload || null,
      };
    case ACTION_TYPE.LIMIT:
      return {
        ...state,
        page: 0,
        offset: action.payload || 3,
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

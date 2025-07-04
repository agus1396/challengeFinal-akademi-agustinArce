import { STATS_REQUEST, STATS_SUCCESS, STATS_FAIL } from "../actions/statsActions";

const initialState = {
  loading: false,
  stats: null,
  error: null,
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATS_REQUEST:
      return { ...state, loading: true, error: null };
    case STATS_SUCCESS:
      return { loading: false, stats: action.payload, error: null };
    case STATS_FAIL:
      return { loading: false, stats: null, error: action.payload };
    default:
      return state;
  }
};

export default statsReducer;

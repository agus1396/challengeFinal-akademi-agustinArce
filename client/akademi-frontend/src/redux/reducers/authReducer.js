const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };

    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return initialState; // Limpia todo al desloguearse

    case "REGISTER_REQUEST":
      return { ...state, loading: true };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: null,
        error: null,
      };

    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;

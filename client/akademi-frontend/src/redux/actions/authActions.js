import api from '../../api/axios';

export const login = (email, password) => {
  return async (dispatch) => {
    try { 
      dispatch({ type: 'LOGIN_REQUEST' });

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);

      // Guardamos el token y datos del usuario en Redux
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user,
        },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.error || 'Error de autenticación',
      });
    }
  };
};

export const logout = () => {
  return { type: 'LOGOUT' };
};

export const registerUser = (userData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });

      const response = await api.post('/auth/register', userData);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: response.data,
      });
      navigate('/login');
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.response?.data?.error || 'Error al registrar usuario',
      });
    }
  };
};

/* export const createProfessor = (userData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'CREATE_USER_REQUEST' });

      const { token } = getState().auth;

      await api.post('/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: 'CREATE_USER_SUCCESS' });

      return true; // ✅ éxito
    } catch (error) {
      dispatch({
        type: 'CREATE_USER_FAILURE',
        payload: error.response?.data?.error || 'Error al crear usuario',
      });

      return false; // ❌ error
    }
  };
}; */


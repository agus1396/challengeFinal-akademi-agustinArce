import axios from "axios";

export const STATS_REQUEST = "STATS_REQUEST";
export const STATS_SUCCESS = "STATS_SUCCESS";
export const STATS_FAIL = "STATS_FAIL";

export const fetchStats = () => async (dispatch, getState) => {
  dispatch({ type: STATS_REQUEST });

  try {
    const {
      auth: { token },
    } = getState();

    const { data } = await axios.get("/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: STATS_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error al cargar estadísticas", error.response?.data || error.message);
    dispatch({
      type: STATS_FAIL,
      payload: error.response?.data?.error || "Error al cargar estadísticas",
    });
  }
};

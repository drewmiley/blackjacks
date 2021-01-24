import { createSlice } from '@reduxjs/toolkit';

export const setupSlice = createSlice({
  name: 'setup',
  initialState: {
    value: null,
  },
  reducers: {
    setIsSuccessful: (state, action) => {
      state.value = action.payload;
    }
  },
});

export const { setIsSuccessful } = setupSlice.actions;

export const createGame = playerNames => async dispatch => {
  const response = await fetch('http://localhost:8000/api/init/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ players: playerNames.split(',') })
    });
  const jsonResponse = await response.json();
  dispatch(setIsSuccessful(jsonResponse.message));
}

export const setupIsSuccessful = state => state.setup.value;

export default setupSlice.reducer;

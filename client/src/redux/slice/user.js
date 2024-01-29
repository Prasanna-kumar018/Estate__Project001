import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setuser(state, action) {
      return {
        ...action.payload,
      };
    },
    deleteuser(state, action)
    {
      return null;
    }
  },
});

export default user.reducer;
export { user };

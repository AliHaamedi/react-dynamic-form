import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {},
  reducers: {
    initializeForm: (state, action) => {
      const fields = action.payload.fields;
      fields.forEach((field) => {
        state[field.name] =
          field.default || (field.type === "checkbox" ? false : "");
      });
    },
    updateForm: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => ({}),
  },
});

export const { initializeForm, updateForm, resetForm } = formSlice.actions;
export default formSlice.reducer;

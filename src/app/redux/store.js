import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice";

export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer
    }
});
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // change when deployed
});

// Fields
export const createField = (data: any) => API.post("/fields/", data);
export const getFields = () => API.get("/fields/");

// Forms
export const createForm = (data: any) => API.post("/forms/", data);
export const getFormByLink = (link: string) => API.get(`/forms/${link}`);

// Responses
export const submitResponse = (data: any) => API.post("/responses/", data);
export const getResponses = (formId: number) => API.get(`/responses/${formId}`);

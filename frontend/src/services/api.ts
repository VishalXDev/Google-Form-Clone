import axios from "axios";

// Change to your deployment URL when hosting
const API = axios.create({
  baseURL: "http://localhost:8000",
});

// ========== Types ==========
export interface FieldCreatePayload {
  label: string;
  field_type: "text" | "number" | "single_choice";
  options?: string[];
}

export interface FormCreatePayload {
  title: string;
  field_ids: number[];
}

export interface ResponsePayload {
  form_id: number;
  answers: Record<string, string>;
}

// ========== API Requests ==========

// Fields
export const createField = (data: FieldCreatePayload) => API.post("/fields/", data);
export const getFields = () => API.get("/fields/");

// Forms
export const createForm = (data: FormCreatePayload) => API.post("/forms/", data);
export const getFormByLink = (link: string) => API.get(`/forms/${link}`);
export const getFormById = (id: number) => API.get(`/forms/id/${id}`); // ✅ NEW

// Responses
export const submitResponse = (data: ResponsePayload) => API.post("/responses/", data);
export const getResponses = (formId: number) => API.get(`/responses/${formId}`);

export default API;

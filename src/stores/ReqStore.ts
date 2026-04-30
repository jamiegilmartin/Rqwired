import { defineStore } from "pinia";
import { ref } from "vue";
import { type Req } from "@/models/Req";

export const useReqStore = defineStore("reqs", () => {
  const lsKey = "reqs";
  const isInitialized = ref(false);

  const reqs = ref<Req[]>([]);

  const setReqs = (reqs: Req[]) => {
    reqs.value = reqs;
    isInitialized.value = true;
    localStorage.setItem(lsKey, JSON.stringify(reqs));
  };

  const addReq = (req: Omit<Req, "id" | "createdAt" | "updatedAt">) => {
    const newReq: Req = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...req,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reqs.value.push(newReq);
    localStorage.setItem(lsKey, JSON.stringify(reqs.value));

    return newReq;
  };

  const removeReq = (id: string) => {
    reqs.value = reqs.value.filter((req:Req) => req.id !== id);
    localStorage.setItem(lsKey, JSON.stringify(reqs.value));
  };

  const updateReq = (
    id: string,
    updates: Partial<Omit<Req, "id" | "createdAt">>,
  ) => {
    const index = reqs.value.findIndex((req:Req) => req.id === id);
    if (index !== -1) {
      reqs.value[index] = { ...reqs.value[index], ...updates };
      localStorage.setItem(lsKey, JSON.stringify(reqs.value));
      return reqs.value[index];
    }
    return null;
  };

  const getReq = (id: string): Req | null => {
    const req = reqs.value.find((req:Req) => req.id === id);
    return req || null;
  };

  const getReqsByTag = (type: string): Req[] => {
    return reqs.value.filter((req:Req) => req.tags.includes(type));
  };

  const getAllReqs = (): Req[] => {
    return reqs.value;
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem(lsKey);
    if (stored) {
      reqs.value = JSON.parse(stored);
      isInitialized.value = true;
    }
  };
  const clearAll = () => {
    reqs.value = [];
    localStorage.removeItem(lsKey);
  };

  return {
    reqs,
    addReq,
    removeReq,
    updateReq,
    getReq,
    getAllReqs,
    getReqsByTag,
    loadFromLocalStorage,
    clearAll,
  };
});

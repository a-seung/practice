import api from "@/api";
import refreshToken from './refreshToken';

const BASE_URL = "/asset";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 총 자산 분석
    async showAnalysis() {
      const response = await refreshToken.checkToken();
        const { data } = await api.get(`${BASE_URL}/analysis`);
        //console.log("ASSET GET LIST", data);
        return data;
    },

  // 소비패턴 분석
    async showSpendingPatterns(year) {
        const { data } = await api.get(`${BASE_URL}/spending-patterns?year=${year}`);
        //console.log("ASSET GET PATTERN", data);
        return data;
    },

  // 예적금 상품 추천
    async showProductRecommendations() {
        const { data } = await api.get(`${BASE_URL}/product-recommendations`);
        // console.log("ASSET GET RECOMMENTAIONS", data);
        return data;
    },

  // 나이별 자산 비교
    async showAgeComparison() {
        const { data } = await api.get(`${BASE_URL}/age-comparison`);
        // console.log("ASSET GET AGE-COMPARISON", data);
        return data;
    }
};
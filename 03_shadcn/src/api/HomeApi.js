import api from '@/api';
import refreshToken from './refreshToken';


const BASE_URL = '/home';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 내 정보 가져오기
  async getMyInfo() {
    const response = await refreshToken.checkToken();
    const { data } = await api.get(`${BASE_URL}/info`);
    return data;
},

//foote용 내 정보 가져오기(refresh 확인 안함)
  async getMyInfoFooter() {
    const { data } = await api.get(`${BASE_URL}/info`);
    return data;
},

  // 설문조사 가져오기
  async surveyList() {
    const response = await refreshToken.checkToken();
    const { data } = await api.get(`${BASE_URL}/fin-test`);
    return data;
  },

  // 설문 결과 보내기
  async submitSurvey(survey) {
    //console.log(survey);
    const { data } = await api.post(
      `${BASE_URL}/fin-save`,
      survey,
      { 
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return data;
  },

  // 설문 결과 내용 조회
  async surveyResult() {
    const response = await refreshToken.checkToken();
    const { data } = await api.get(
      `${BASE_URL}/fin-type`
    );
    return data;
  },

    // 은행 아이디, 비번 받고, 해당 은행 계좌 정보 받아오기
    async getAccountList(bankAccount) {
        const { data } = await api.post(
          `${BASE_URL}/account/add`,
          bankAccount,
          { 
            headers: {
              'Content-Type': 'application/json',
            },
          });
        return data;
    },

  // 미션보기
  async missionList(userId) {
    const response = await refreshToken.checkToken();
    const { data } = await api.get(
      `${BASE_URL}/${userId}/mission`
    );
 //   console.log('HOME GET MISSIONLIST', data);
    return data;
  },

 // 미션보기
 async missionListFooter(userId) {
  const { data } = await api.get(
    `${BASE_URL}/${userId}/mission`
  );
//   console.log('HOME GET MISSIONLIST', data);
  return data;
},

  // 계좌 목록 조회
    async accountList() {
      const response = await refreshToken.checkToken();
        const { data } = await api.get(`${BASE_URL}/account/list`);
        return data;
    },

    async accountListFooter() {
      const { data } = await api.get(`${BASE_URL}/account/list`);
      return data;
  },
    
    // 거래 내역 조회
    async transactionList(accountNum, limit = 10, offset = 0) {
      const response = await refreshToken.checkToken();
        const { data } = await api.get(`${BASE_URL}/account/${accountNum}/transactions`,{
          params: {
            limit: limit,
            offset: offset
          }
        });
     //   console.log("거래내역 api :",response);
        return data;
    },

    //거래내역 재요청 조회
    async refreshTransactionList(accountNum) {
      const { data } = await api.post(
        `${BASE_URL}/account/update-transactions`,
        {accountNum},
        { 
          headers: {
            'Content-Type': 'application/json',
          },
        });
      return data;
    },

    // 미션 생성
    async createMission() {
        const { data } = await api.get(`/mission/update-mission`);
        return data;
    }


};


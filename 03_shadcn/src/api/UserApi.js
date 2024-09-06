import api from '@/api/ex_index';

const BASE_URL = '/user';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  //일반 회원가입
  async signup(user) {
    const { data } = await api.post(
      `${BASE_URL}/signup`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  // ID중복체크
  async idDuplicateCheck(userID) {
    const { data } = await api.get(
      `${BASE_URL}/login/${userID}`
    );
    return data;
  },

// email 중복체크
async emailDuplicateCheck(userEmail) {
  const { data } = await api.get(
    `${BASE_URL}/check-email`,
    { params: { email: userEmail } } // 'params'로 수정
  );
  return data;
},

// nickname 중복체크
async nicknameDuplicateCheck(userNickname) {
  const { data } = await api.get(
    `${BASE_URL}/check-nickname`,
    { params: { nickname: userNickname } } // 'params'로 수정
  );
  return data;
},

  // 소셜 회원가입 정보전달
  async socialSignupInfo() {
    const { data } = await api.get(
      `${BASE_URL}/social-signup/info`
    );
    return data;
  },

  // 소셜 회원가입 등록
  async socialSignupRegister(user) {
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }

    const { data } = await api.post(
      `${BASE_URL}/social-signup/register`,
      formData,
      { headers }
    );
    return data;
  },

  // 일반 로그인
  async login(user) {
    const { data } = await api.post(
      `${BASE_URL}/login`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  // 소셜 로그인
  async socialLogin(user) {
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }

    const { data } = await api.post(
      `${BASE_URL}/social-login`,
      formData,
      { headers }
    );
    return data;
  },

  // 로그아웃
  async logout() {
    const { data } = await api.get(
      `${BASE_URL}/logout`
    );
    return data;
  },

  // 아이디찾기
  async findUserId(user) {
    const { data } = await api.post(
      `${BASE_URL}/find-id`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  // 비밀번호 찾기
  async findUserPwd(user) {
    const { data } = await api.post(
      '/user/find-pwd',
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  // 정책 받아오기
  async getTerms() {
    const { data } = await api.get(
      `${BASE_URL}/terms`
    );
    return data;
  },
};

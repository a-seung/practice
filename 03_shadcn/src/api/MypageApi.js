import api from '@/api';

const BASE_URL = '/mypage';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 마이페이지 조회
  async getMypage() {
    const { data } = await api.get(`${BASE_URL}/info`);
  //  console.log('MYPAGE GET INFO', data);
    return data;
  },

  // 로그인된 사용자 ID 조회
  async getLoggedInUserId() {
    const response = await api.get(`${BASE_URL}/logged-in-user-id`);
   // console.log('LOGGED IN USER ID:', response); // 전체 응답을 로그로 확인
    return response.data; // 서버에서 반환하는 전체 데이터 객체
  },
  
  // 사용자 공개/비공개 상태 업데이트 API
  async updateVisibility(visibility) {
    const { data } = await api.post('/mypage/update-visibility', { visibility });
 //   console.log('MYPAGE VISIBILITY UPDATE', data);
    return data;
  },

  // 뱃지 설명 조회
  async getBadgeInfo() {
    const { data } = await api.get(`${BASE_URL}/badge`);
 //   console.log('MYPAGE GET BADGE', data);
    return data;
  },

  // 작성한 글 조회
  async getMyPosts() {
    const { data } = await api.get(`${BASE_URL}/posts`);
  //  console.log('MYPAGE GET MY POSTS', data);
    return data;
  },

  // 좋아한 글 조회
  async getMyLikePosts() {
    const { data } = await api.get(`${BASE_URL}/mylikehits`);
   // console.log('MYPAGE GET MY LIKE POSTS', data);
    return data;
  },

  // 로그인 타입 조회
  async getMyLoginType() {
    const { data } = await api.get(`${BASE_URL}/login-type`);
  //  console.log('MYPAGE GET LOGIN TYPE', data);
    return data;
  },

  // 회원정보 수정에서 기존 정보 가져오기 (일반, 소셜 동일)
  async getMyExistingInfo() {
    const { data } = await api.get(`${BASE_URL}/edit-form`);
  //  console.log('MYPAGE GET Existing My Profile', data);
    return data;
  },

  // 기존 비밀번호 확인
  async checkPassword(password) {
    const { data } = await api.post(`${BASE_URL}/check-password`, { password });
   // console.log('MYPAGE CURRENT PASSWORD CHECK', data);
    return data;
  },

  // 회원정보 수정 (일반, 소셜 동일)
  async edit(user) {
    const { data } = await api.post(
      `${BASE_URL}/edit-save`,
      user // 객체 형태로 전송
    );
    //console.log('MYPAGE USER INFO EDIT', data);
    return data;
  },

  // 특정 사용자의 프로필 정보 조회
async getUserProfile(userId) {
  const { data } = await api.get(`${BASE_URL}/info/${userId}`);
  //console.log('MYPAGE GET USER PROFILE', data);
  return data;
},

// 특정 사용자 작성한 글 조회
async getMyPostsUserId(userId) {
  const { data } = await api.get(`${BASE_URL}/posts/${userId}`);
//  console.log('MYPAGE GET MY POSTS', data);
  return data;
},

// 특정 사용자 좋아한 글 조회
async getMyLikePostsUserId(userId) {
  const { data } = await api.get(`${BASE_URL}/mylikehits/${userId}`);
 // console.log('MYPAGE GET MY LIKE POSTS', data);
  return data;
}
};

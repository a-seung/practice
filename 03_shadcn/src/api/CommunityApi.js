import api from '@/api';

const BASE_URL = '/community';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 게시글 목록 조회
  async list(
    category,
    type,
    sort,
    currentPage,
    pageSize = 10
  ) {
    const formData = new FormData(); // FormData 객체 생성
    if (category !== -1)
      formData.append('category', category);
    if (type !== -1)
      formData.append('type', type);
    formData.append('sort', sort);
    formData.append('offset', currentPage);
    formData.append('pageSize', pageSize);

    const response = await api.post(
      `${BASE_URL}`,
      formData,
      { headers }
    );
    return response; //data 속성을 반환하지 않고 전체 응답을 반환
  },

  // 게시글 상세 조회
  async detail(postId) {
    const response = await api.get(
      `${BASE_URL}/${postId}`
    );
    // console.log(
    //   'COMMUNITY GET DETAIL',
    //   response.data
    // ); //받아온 데이터 출력
    return response.data;
  },

  //게시글작성
  async write(formData) {
    try {
      const response = await api.post(
        `${BASE_URL}/write`,
        formData,
        {
          headers,
        }
      );
      // console.log(
      //   '커뮤니티 글 작성 전체 응답',
      //   response
      // );
      return response.data;
    } catch (error) {
      console.error(
        '게시글 작성 중 오류 발생:',
        error.response || error
      );
      throw error;
    }
  },

  // 게시글 좋아요
  async likePost(postId, userId) {
    const response = await api.post(
      `${BASE_URL}/${postId}/like`,
      { userId }
    );

    // 서버에서 갱신된 postLikeHits 값을 응답으로 받는다고 가정
   // console.log('COMMUNITY POST LIKE', response);
    return response.data; // 좋아요 처리 후 변경된 데이터 반환
  },

  // 게시글 수정
  async update(postId, formData) {
   // console.log(postId);
    const response = await api.post(
      `${BASE_URL}/${postId}/update`,
      formData,
      {
        headers,
      }
    );
    // console.log(
    //   'COMMUNITY POST UPDATE',
    //   response
    // );
    return response.data;
  },


  // 게시글 삭제
  async delete(postId) {
    const response = await api.delete(
      `${BASE_URL}/${postId}/delete`
    );
  //  console.log('COMMUNITY DELETE', response);
    return response.data;
  },
};

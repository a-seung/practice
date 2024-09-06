<template>
  <div class="page flex flex-col">
    <!-- 좋아요순 & 최신순 -->
    <div class="lg:flex lg:w-full">
      <!-- 사이드바 및 필터 -->
      <aside class="lg:w-40 lg:fixed">
        <div class="lg:mt-11 section-style lg:px-6 lg:pt-4">
          <!-- 필터 드롭다운: 카테고리, 자산유형 -->
          <div class="flex flex-col gap-2">
            <div class="">
              <div class="block text-sm font-bold mb-2 text-left">카테고리</div>
              <div class="flex flex-wrap gap-2 lg:flex-col lg:ml-1">
                <button
                  @click="selectCategory(-1)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedCategory !== -1,
                      'community-filter-click': selectedCategory === -1,
                    },
                  ]"
                >
                  전체
                </button>
                <button
                  @click="selectCategory(1)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedCategory !== 1,
                      'community-filter-click': selectedCategory === 1,
                    },
                  ]"
                >
                  예적금
                </button>
                <button
                  @click="selectCategory(2)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedCategory !== 2,
                      'community-filter-click': selectedCategory === 2,
                    },
                  ]"
                >
                  재테크
                </button>
                <button
                  @click="selectCategory(3)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedCategory !== 3,
                      'community-filter-click': selectedCategory === 3,
                    },
                  ]"
                >
                  정보공유
                </button>
                <button
                  @click="selectCategory(4)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedCategory !== 4,
                      'community-filter-click': selectedCategory === 4,
                    },
                  ]"
                >
                  절약팁
                </button>
              </div>
            </div>

            <hr class="border-bottom mb-1" />

            <div class="">
              <div class="block text-sm font-bold mb-2 text-left">자산 유형</div>
              <div class="flex flex-wrap gap-2 lg:flex-col lg:ml-1">
                <button
                  @click="selectFinType(-1)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedFinType !== -1,
                      'community-filter-click': selectedFinType === -1,
                    },
                  ]"
                >
                  전체
                </button>
                <button
                  @click="selectFinType(1)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedFinType !== 1,
                      'community-filter-click': selectedFinType === 1,
                    },
                  ]"
                >
                  꿀벌
                </button>
                <button
                  @click="selectFinType(2)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedFinType !== 2,
                      'community-filter-click': selectedFinType === 2,
                    },
                  ]"
                >
                  호랑이
                </button>
                <button
                  @click="selectFinType(3)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedFinType !== 3,
                      'community-filter-click': selectedFinType === 3,
                    },
                  ]"
                >
                  다람쥐
                </button>
                <button
                  @click="selectFinType(4)"
                  :class="[
                    'community-filter',
                    {
                      'community-filter-hover': selectedFinType !== 4,
                      'community-filter-click': selectedFinType === 4,
                    },
                  ]"
                >
                  나무늘보
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 게시글 리스트 -->
    <main class="lg:w-2/3 flex flex-col mx-auto w-full">
      <div class="flex justify-end my-2">
      <div class="flex items-center space-x-2">
        <button
          @click="sortBy('likeHits')"
          :class="[
            'px-3 py-1 text-sm rounded-md w-20',
            { 'bg-primary text-white': sortType === 'likeHits', 'bg-gray-300': sortType !== 'likeHits' },
          ]"
        >
          좋아요순
        </button>
        <button
          @click="sortBy('latest')"
          :class="[
            'px-3 py-1 text-sm rounded-md w-20',
            { 'bg-primary text-white': sortType === 'latest', 'bg-gray-300': sortType !== 'latest' },
          ]"
        >
          최신순
        </button>
      </div>
    </div>
      <div v-if="posts.length > 0" class="flex flex-col">
        <div v-for="post in sortedPosts" :key="post.postId" class="post-content cursor-pointer hover:border-gray-500 hover:duration-300" @click="goToPostDetail(post.postId)">
          <!-- 얼굴/닉네임/날짜 -->
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-2">
              <div class="community-profile">
                <img
                  :src="getProfileIcon(post.finTypeCode)"
                  class="w-8 h-8 object-obtain"
                  alt="Profile"
                  @click.stop="goToUserProfile(post.userId)"
                />
              </div>
              <div>
                {{ post.userNickname }}
              </div>
            </div>
            <div class="text-gray-500 text-sm">{{ formatDate(post.postCreatedTime) }}</div>
          </div>

          <div class="mx-2 pt-2">
            <div class="community-title text-lg font-semibold mb-1">
              {{ post.postTitle }}
              <i
                v-if="post.postImagePaths && post.postImagePaths.length"
                class="fa-regular fa-image ml-2"
                style="color: #5354ff"
              ></i>
            </div>

            <div class="community-content text-sm text-gray-600 my-2 truncate">
              {{ post.postContent }}
            </div>

            <div class="mt-1 text-red-500">
              <button @click.stop="likePost(post.postId, post.userId)">
                <span>{{ post.isLiked ? '♥ ' : '♡ ' }}</span>
                <span class="mt-1 text-black">{{ post.postLikeHits }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-center text-gray-500">게시글이 없습니다.</p>
      </div>

      <!-- 새 글 작성 버튼 -->
      <router-link v-if="userName != 'NoLogin'" to="/community/add" class="add-button">
        <i class="fas fa-plus"></i>
      </router-link>

      <!-- 페이지네이션 -->
      <div class="pagination flex justify-center items-center space-x-8 mt-4 mb-12 overflow-x-auto">
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="disabled:opacity-50">
          <i class="fas fa-angle-double-left text-xl"></i>
        </button>

        <button @click="goToPreviousPage" :disabled="currentPage === 1" class="disabled:opacity-50">
          <i class="fas fa-angle-left text-xl"></i>
        </button>

        <div class="text-lg">페이지 <span class="px-2 font-bold">{{ currentPage }}</span> / <span class="px-2">{{ totalPage }}</span></div>

        <button @click="goToNextPage" :disabled="currentPage === totalPage" class="disabled:opacity-50">
          <i class="fas fa-angle-right text-xl"></i>
        </button>

        <button @click="goToPage(totalPage)" :disabled="currentPage === totalPage" class="disabled:opacity-50">
          <i class="fas fa-angle-double-right text-xl"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, watch } from 'vue';
import communityApi from '@/api/CommunityApi';
import HomeApi from '@/api/HomeApi';
import MypageApi from '@/api/MypageApi';
import { useRouter } from 'vue-router';
import { useCommunityStore } from '@/stores/community';

const communityStore = useCommunityStore();
const userName = ref('');
const router = useRouter();
const loggedInUserId = ref(null);

const goToPostDetail = (postId) => {
  if (userName.value === 'NoLogin') {
    alert('로그인 후 이용해주세요.');
  } else {
    router.push({
      name: 'communityDetail',
      params: { postId },
    });
  }
};

// 로그인된 사용자 ID를 미리 가져오는 함수
const fetchLoggedInUserId = async () => {
  try {
    const userId = await MypageApi.getLoggedInUserId();
    if (userId) {
      loggedInUserId.value = userId;
    } else {
      //  console.error('유효한 사용자 ID를 가져오지 못했습니다.');
    }
  } catch (error) {
    //    console.error('로그인된 사용자 ID를 가져오는 중 오류 발생:', error);
  }
};

// 게시글 데이터 상태 관리
const posts = ref([]); //API로 가져온 게시글 데이터
const currentPage = ref(communityStore.getCurrentPage()); //현재 페이지 번호
const totalPage = ref(1); //총 페이지 수를 1로 초기화
const pageSize = ref(10);
const isFetching = ref(false); //데이터 로딩 상태 관리
const hasMorePosts = ref(true);

//정렬 및 필터 상태 관리
const sortType = ref('latest'); // 기본 정렬은 최신순
const selectedCategory = ref('-1'); // 초기값을 '-1'로 설정
const selectedFinType = ref('-1'); // 초기값을 '-1'로 설정

// 사용자 정보를 가져오는 함수
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    userName.value = userInfo.userName;
  } catch (error) {
    //  console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
  }
};

// 게시글 정렬 기능
const sortedPosts = computed(() => {
  if (sortType.value === 'likeHits') {
    return [...posts.value].sort((a, b) => b.postLikeHits - a.postLikeHits);
  } else if (sortType.value === 'latest') {
    return [...posts.value].sort((a, b) => new Date(b.postCreatedTime) - new Date(a.postCreatedTime));
  }
  return posts.value;
});

// 정렬 변경 함수
const sortBy = (type) => {
  sortType.value = type;
};

const selectCategory = (categoryId) => {
  if(selectedCategory.value ==categoryId){
    selectedCategory.value = -1;
  }else{
    selectedCategory.value = categoryId;
  }
};

const selectFinType = (finTypeCode) => {
  if(selectedFinType.value ==finTypeCode){
    selectedFinType.value = -1;
  }else{
    selectedFinType.value = finTypeCode;
  }
};

// 프로필 페이지로 이동하는 함수
const goToUserProfile = async (userId) => {
  if (userName.value === 'NoLogin') {
    alert('로그인 후 이용해주세요.');
    return; // 로그인하지 않은 경우 함수 종료
  }

  try {
    if (!loggedInUserId.value) {
      await fetchLoggedInUserId();
    }

    // userId가 같은지 확인
    if (Number(userId) === Number(loggedInUserId.value)) {
      router.push({ name: 'mypage' });
    } else {
      router.push({ name: 'userMypage', params: { userId } });
    }
  } catch (error) {
    console.error('프로필 이동 중 오류 발생:', error);
  }
};

// 프로필 사진 가져오는 함수
const getProfileIcon = (finTypeCode) => {
  // finTypeCode가 유효한지 확인
  if (finTypeCode && finTypeCode !== 0) {
    return `images/${finTypeCode}-face.png`;
  }
  // 기본 이미지 반환
  return 'images/0.png';
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

// 게시글 목록을 API에서 가져오는 함수
const fetchPosts = async () => {
  try {
    if (isFetching.value) return;
    isFetching.value = true;

    const category = selectedCategory.value;
    const finType = selectedFinType.value;
    const nowSortType = sortType.value;

    const response = await communityApi.list(category, finType, nowSortType, currentPage.value - 1, pageSize.value);

    if (response && response.data) {
      posts.value = [];
      posts.value = response.data.list || [];
      totalPage.value = response.data.totalPage || 1;
    } else {
      posts.value = [];
      totalPage.value = 1;
    }
    await getLike();
  } catch (error) {
    //   console.error("게시글 불러오기 실패:", error);
    posts.value = [];
    totalPage.value = 1;
  } finally {
    isFetching.value = false;
  }
};

//사용자가 좋아요 한 게시글 표시
const getLike = async () => {
  try {
    const userLikePosts = await MypageApi.getMyLikePosts();
    const likedPostIds = userLikePosts.map((post) => post.postId); // 좋아요 누른 게시글의 postId 목록 추출

    // fetchPosts로 가져온 posts 배열에서 좋아요한 게시글들을 찾아서 isLiked를 true로 설정
    posts.value.forEach((post) => {
      if (likedPostIds.includes(post.postId)) {
        post.isLiked = true;
      } else {
        post.isLiked = false;
      }
    });
  } catch (error) {
    //console.log(error);
  }
};

// 좋아요 기능
const likePost = async (postId, userId) => {
  if (userName.value === 'NoLogin') {
    alert('로그인 후 이용해주세요.');
    return; // 로그인하지 않은 경우 함수 종료
  }

  try {
    if (!postId || !userId) {
      //     console.error('게시글번호 또는 작성자번호가 없습니다');
      return;
    }
    if (userId != 99) {
      //좋아요 API 호출
      const response = await communityApi.likePost(postId, userId);

      /// 좋아요 상태를 업데이트 (post 객체에 직접 접근하지 않고 posts 배열에서 해당 게시글을 찾아 업데이트)
      const postIndex = posts.value.findIndex((post) => post.postId === postId);
      if (postIndex !== -1) {
        posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
        // 서버에서 반환된 값을 반영
        if (response && response.postLikeHits !== undefined) {
          posts.value[postIndex].postLikeHits = response.postLikeHits;
        } else {
          // 서버 응답이 없으면 로컬에서 값을 증가/감소
          posts.value[postIndex].postLikeHits += posts.value[postIndex].isLiked ? 1 : -1;
        }
      }
    }
  } catch (error) {
    //  console.error('Error:', error);
  }
};

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPage.value) return;
  currentPage.value = pageNumber;
  communityStore.setCurrentPage(currentPage.value);
  fetchPosts();
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    communityStore.setCurrentPage(currentPage.value);
    fetchPosts();
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPage.value) {
    currentPage.value += 1;
    communityStore.setCurrentPage(currentPage.value);
    fetchPosts();
  }
};

watch([selectedCategory, selectedFinType, sortType], () => {
  currentPage.value = 1;
  communityStore.setCurrentPage(currentPage.value);
  fetchPosts();
});

// 컴포넌트가 마운트되면 게시글을 불러옴
onMounted(async () => {
  await fetchLoggedInUserId(); // 이 부분에서 API 호출이 완료될 때까지 기다림
  if (loggedInUserId.value) {
    await getUser();
  } else {
    //      console.error('로그인된 사용자 ID를 가져오지 못했습니다.');
  }
  await fetchPosts();
});
</script>

<style scoped>
.truncate{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 모바일 화면에서만 margin-bottom을 적용 */
@media (max-width: 768px) {
  .container {
    margin-bottom: 4rem; /* 모바일에서 footer에 가려지지 않도록 여백 추가 */
  }
}
</style>

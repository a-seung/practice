<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="handleBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    </header>

    <div class="section-style space-y-3">
      <!-- 제목 입력 -->
      <div>
        <label class="label" for="title">제목</label>
        <input class="input" v-model="formData.title" type="text" id="title" placeholder="제목을 입력해주세요" />
      </div>

      <!-- 카테고리 선택 -->
      <div>
        <label class="label" for="category">카테고리</label>
        <select v-model="selectedCategory" id="category" class="flex items-center justify-center drop-down">
          <option value="" disabled>카테고리를 선택해주세요</option>
          <!-- Placeholder 추가 -->
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <!-- 본문 입력 -->
      <div>
        <label class="label" for="content">본문</label>
        <textarea
          class="input h-[150px]"
          v-model="formData.content"
          id="content"
          placeholder="다른 사용자에게 유용한 정보를 제공해주세요. 광고성 & 홍보성 게시글은 삭제될 수 있습니다."
        ></textarea>
      </div>

   
        <!-- 사진 추가하기 -->
        <div class="form-group ml-2 border-t border-gray-300">
          <div class="flex items-center space-x-2 mt-6">
            <label class="font-semibold">사진 추가하기</label>
            <input id="file-upload" class="file-input" type="file" accept="image/*" @change="onFileChange" multiple />
            <label for="file-upload" class="file-label">파일 선택</label>
          </div>

          <!-- 파일 이름을 쉼표로 구분하여 출력 -->
          <p class="text-xs mt-2">{{ fileNames.join(', ') }}</p>

          <!-- 기존 이미지와 새로운 이미지를 미리보기로 함께 보여줍니다 -->
          <div class="image-preview flex space-x-2 mt-3" v-if="imagePreviews.length > 0">
            <img v-for="(image, index) in imagePreviews" :key="index" :src="image" @click="onImageClick(index)" />
          </div>
          <p class="notification-text mt-2 !pl-0">사진은 최대 {{ maxImages }}개까지만 업로드할 수 있어요.</p>
        </div>
  

      <!-- 게시글 등록 버튼 -->
      <button @click="submitPost" class="button !mb-4">게시글 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import communityApi from '@/api/CommunityApi'; // API 모듈 임포트

const router = useRouter();
const route = useRoute();

const formData = ref({
  title: '',
  content: '',
  category: '',
  images: [],
});

const handleBack = () => {
  // 알림창 띄우기
  const confirmed = window.confirm('게시글 작성을 취소하시겠습니까? 작성했던 정보는 모두 사라집니다.');
  if (confirmed) {
    // 사용자가 확인을 눌렀을 때 CommunityList.vue로 이동
    router.push({ name: 'communityList' });
  }
};

const categories = ref([
  { id: 1, name: '예적금' },
  { id: 2, name: '재테크' },
  { id: 3, name: '정보공유' },
  { id: 4, name: '절약팁' },
]);

const selectedCategory = ref(''); // 새글 작성 시 빈 문자열로 초기화
const imagePreviews = ref([]); // 기본 이미지 미리보기 설정
const fileNames = ref([]); //파일명 배열

const fetchPostDetails = async (postId) => {
  try {
    const response = await communityApi.detail(postId);
    formData.value.title = response.postTitle || '';
    formData.value.content = response.postContent || '';
    selectedCategory.value = response.postCategory || '';
    //images 처리
    processImages(response.postImagePaths);
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생: ', error);
  }
};

//이미지 처리 함수
const processImages = (images) => {
  //images가 undefined일 경우 빈 배열로 처리
  if (!images) {
    formData.value.images = [];
  }
  //images가 배열일 경우 그대로 사용
  else if (Array.isArray(images)) {
    formData.value.images = images; //서버에서 배열로 받아옴
  } else if (typeof images === 'string') {
    formData.value.images = images.split(','); //문자열이면 분할
  }
  // 서버에서 받은 이미지 경로로 미리보기 이미지 배열을 생성
  imagePreviews.value = formData.value.images.map((img) => img);
  fileNames.value = formData.value.images.map((img) => img.split('/').pop());
};

const maxImages = 3;

const onFileChange = (event) => {
  const files = Array.from(event.target.files);

  if (formData.value.images.length + files.length > maxImages) {
    alert(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`);
    return;
  }

  files.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      alert('사진만 업로드 가능합니다.');
      return;
    }
    formData.value.images.push(file); // formData에 이미지 파일 추가
    fileNames.value.push(file.name); //파일명 추가

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result); // 미리보기 URL 저장
    };
    reader.readAsDataURL(file);
  });
};

const onImageClick = (index) => {
  // 선택된 이미지 삭제
  formData.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  fileNames.value.splice(index, 1);
};

const rebuildCheck = ref(false);
const rebuildID = ref('');
const submitPost = async () => {
  // 필수값 검증
  if (!formData.value.title || !selectedCategory.value || !formData.value.content) {
    alert('모든 필드를 입력해 주세요.');
    return;
  }

  const formDataToSubmit = new FormData();

  // 게시글 정보 추가
  formDataToSubmit.append('postTitle', formData.value.title);
  formDataToSubmit.append('postContent', formData.value.content);
  formDataToSubmit.append('postCategory', selectedCategory.value);

  // 이미지 파일 추가
  formData.value.images.forEach((image) => {
    if (image instanceof File) {
      formDataToSubmit.append('files', image); // 이미지 처리
    }
  });

  // FormData가 잘 추가되었는지 확인 로그
  for (let [key, value] of formDataToSubmit.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    console.log(rebuildCheck.value);
    // API 요청: 게시글 작성 (이미지 포함)
    if (rebuildCheck.value) {
      console.log('go');
      const response = await communityApi.update(rebuildID.value, formDataToSubmit);
      console.log('서버 응답:', response);

      alert('게시글이 성공적으로 작성되었습니다.');
      router.push({ name: 'communityList' });
    } else {
      const response = await communityApi.write(formDataToSubmit);
      console.log('서버 응답:', response);

      alert('게시글이 성공적으로 작성되었습니다.');
      router.push({ name: 'communityList' });
    }
  } catch (error) {
    console.error('게시글 업로드 실패:', error);

    if (error.message === '토큰을 찾을 수 없습니다. 로그인 후 다시 시도해 주세요.') {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      router.push({ name: 'login' }); // 로그인 페이지로 이동
    } else if (error.response) {
      alert('게시글 업로드에 실패했습니다: ' + (error.response.data || error.response.statusText));
    } else {
      alert('게시글 업로드에 실패했습니다: ' + error.message);
    }
  }
};

const setFlag = (flag, postId) => {
  rebuildCheck.value = flag;
  rebuildID.value = postId;
};

// 컴포넌트가 마운트될 때 게시글 세부정보를 가져옵니다.
onMounted(() => {
  if (route.query.postId) {
    // 수정 모드인 경우
    fetchPostDetails(route.query.postId); //게시글 세부 정보 가져오기
    setFlag(route.query.flag, route.query.postId);
  }
});
</script>

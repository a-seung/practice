<template>
  <div class="page">
    <div class="analysis-page lg:grid lg:grid-cols-2">
      <!-- 총자산 분석 섹션 -->
      <div class="section-style lg:col-span-2">
        <div class="border-bottom flex justify-between items-center pb-3">
          <p class="section-title">총 자산 분석</p>
          <p class="text-xl font-semibold">{{ totalBalance.toLocaleString() }} 원</p>
        </div>

        <div class="mt-10 px-2">
          <div class="bar-chart flex w-full h-8 bg-gray-200 border border-gray-300 mt-5 relative">
            <div
              class="bar-segment bg-indigo-300 h-full"
              :style="{ width: cashPercentage + '%' }"
              @click="showValue($event, cashPercentage, 0, '입출금 자산')"
            ></div>
            <div
              class="bar-segment bg-indigo-600 h-full"
              :style="{ width: depositSavingsPercentage + '%' }"
              @click="showValue($event, depositSavingsPercentage, 1, '예적금 자산')"
            ></div>
            <div
              class="bar-segment bg-indigo-900 h-full"
              :style="{ width: Math.max(etcPercentage, 1) + '%' }"
              @click="showValue($event, etcPercentage, 2, '기타 자산')"
            ></div>
            <!-- 말풍선 (tooltip) -->
            <div
              v-if="show"
              class="absolute bg-gray-700 text-white text-sm rounded p-2"
              :style="{ top: tooltipY + 'px', left: tooltipX + 'px' }"
            >
              {{ clickedLabel }}: {{ clickedValue }}%<br />
              {{ clikedValance.value.toLocaleString() }}원
            </div>
          </div>

          <!-- 범례 -->
          <div class="legend flex justify-start mt-5">
            <div class="legend-item flex items-center mr-2 text-xs lg:text-sm">
              <span class="legend-color bg-indigo-300 w-3 h-3 rounded-full mr-2"></span>
              입출금 자산
            </div>
            <div class="legend-item flex items-center mr-2 text-xs lg:text-sm">
              <span class="legend-color bg-indigo-600 w-3 h-3 rounded-full mr-2"></span>
              예적금 자산
            </div>
            <div class="legend-item flex items-center text-xs lg:text-sm">
              <span class="legend-color bg-indigo-900 w-3 h-3 rounded-full mr-2"></span>
              기타 자산
            </div>
          </div>
        </div>
      </div>

      <!-- 소비 분석 섹션 -->
      <div class="section-style lg:col-span-1 lg:order-2 lg:ml-2">
        <div class="border-bottom flex justify-between items-center pb-2">
          <div class="section-title">소비 분석</div>

          <!-- 년도 선택 드롭다운 추가 -->
          <div class="flex items-center">
            <label for="year" class="mr-2">년도 선택 :</label>
            <select
              id="year"
              v-model="selectedYear"
              @change="getSpendingPatterns"
              class="p-2 border border-gray-300 rounded"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-4 px-6 w-full pl-0 pr-0">
          <div class="pl-1">
            지난달보다
            <span class="blue-bold">
              {{ Math.abs(spendings.previousMonthDiff).toLocaleString() }}
            </span>
            {{ spendings.previousMonthDiff >= 0 ? '원 더 썼어요.' : '원 덜 썼어요.' }}
          </div>
          <div class="w-full">
            <canvas id="spendingChart" class="w-full h-72"></canvas>
          </div>
        </div>
      </div>

      <!-- 예·적금 추천 섹션 -->
      <div class="section-style lg:col-span-1 lg:order-1 lg:row-span-2 lg:mr-2">
        <div class="section-title">상품 추천</div>
        <div
          class="recommendation-carousel flex overflow-hidden snap-x snap-mandatory mt-2 lg:mt-4"
          @scrollend="updateSide(currentSlide)"
        >
          <div
            class="carousel-slide flex-none w-full px-4 py-2 border border-gray-300 rounded-lg bg-white mr-5"
            @click="slideRight"
          >
            <div class="section-title">주 거래 은행 상품</div>

            <!-- 상품 리스트를 flex로 나란히 배치 -->
            <!-- <div class="flex mt-4">
      <div class="flex-1 mr-4 border border-gray-300 p-4 rounded-lg"> -->
            <div class="mt-2 lg:mt-4">
              <div class="product-container lg:flex-1 mb-0">
                <p class="pb-3 border-bottom font-semibold">예금상품</p>

                <div class="px-2">
                  <div class="border-bottom mt-3">
                    <div v-if="depositRecomendations[0]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(depositRecomendations[0].bankName)}.png`"
                        class="w-12 mr-2"
                      />
                      <span class="text-xs lg:text-base">{{ depositRecomendations[0].depositProductName }}</span>
                    </div>
                    <div v-if="depositRecomendations[0]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">최고 우대금리 : {{ depositRecomendations[0].depositProductMaxRate }} %</div>
                      <div class="text-sm">기간 : {{ depositRecomendations[0].depositProductTerm }}개월</div>
                      <div v-if="depositRecomendations[0]" class="mb-4">
                        <a
                          :href="depositRecomendations[0].depositProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div v-if="depositRecomendations[1]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(depositRecomendations[1].bankName)}.png`"
                        class="w-12 mr-2"
                      />
                      <span class="text-xs lg:text-base">{{ depositRecomendations[1].depositProductName }}</span>
                    </div>
                    <div v-if="depositRecomendations[1]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">최고 우대금리 : {{ depositRecomendations[1].depositProductMaxRate }} %</div>
                      <div class="text-sm">기간 : {{ depositRecomendations[1].depositProductTerm }}개월</div>
                      <div v-if="depositRecomendations[1]" class="mb-4">
                        <a
                          :href="depositRecomendations[1].depositProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="flex-1 mr-4 border border-gray-300 p-4 rounded-lg"> -->
              <div class="product-container lg:flex-1 mb-0">
                <p class="pb-3 border-bottom font-semibold">적금상품</p>
                <div class="px-2">
                  <div class="border-bottom mt-3">
                    <div v-if="savingsRecommendations[0]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(savingsRecommendations[0].bankName)}.png`"
                        class="w-12 mr-2"
                      />
                      <span class="text-xs lg:text-base">{{ savingsRecommendations[0].savingsProductName }}</span>
                    </div>
                    <div v-if="savingsRecommendations[0]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">최고 우대금리 : {{ savingsRecommendations[0].savingsProductMaxRate }} %</div>
                      <div class="text-sm">
                        기간 :
                        {{ savingsRecommendations[0].savingsProductTerm }}개월
                      </div>
                      <div v-if="savingsRecommendations[0]" class="mb-4">
                        <a
                          :href="savingsRecommendations[0].savingsProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div v-if="savingsRecommendations[1]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(savingsRecommendations[1].bankName)}.png`"
                        class="w-12 mr-3"
                      />
                      <span class="text-xs lg:text-base">{{ savingsRecommendations[1].savingsProductName }}</span>
                    </div>
                    <div v-if="savingsRecommendations[1]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">최고 우대금리 : {{ savingsRecommendations[1].savingsProductMaxRate }} %</div>
                      <div class="text-sm">기간 : {{ savingsRecommendations[1].savingsProductTerm }}개월</div>
                      <div v-if="savingsRecommendations[1]">
                        <a
                          :href="savingsRecommendations[1].savingsProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 다른 은행 상품 -->
          <div
            class="carousel-slide flex-none w-full px-4 py-2 border border-gray-300 rounded-lg bg-white mr-5"
            @click="slideLeft"
          >
            <div class="recommendation-header flex justify-between items-center mb-3">
              <h2 class="section-title">다른 은행 상품</h2>
              <button
                @click.stop="getRandomRecommendations"
                class="ml-10 px-2 py-1 rounded bg-transparent border border-gray-300 cursor-pointer"
              >
                <i class="fa-solid fa-rotate-right"></i>
              </button>
            </div>

            <!-- 상품 리스트를 flex로 나란히 배치 -->
            <!-- <div class="flex"> -->
            <!-- <div class="flex-1 mr-4 border border-gray-300 p-4 rounded-lg"> -->
            <div class="mt-2">
              <div class="product-container lg:flex-1 mb-0">
                <p class="pb-3 border-bottom font-semibold">예금상품</p>

                <div class="px-2">
                  <div class="border-bottom mt-3">
                    <div v-if="depositRecomendations[randomnumber1]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(
                          depositRecomendations[randomnumber1].bankName
                        )}.png`"
                        class="w-12 mr-2"
                      />
                      <span class="text-xs lg:text-base">{{
                        depositRecomendations[randomnumber1].depositProductName
                      }}</span>
                    </div>
                    <div v-if="depositRecomendations[randomnumber1]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">
                        최고 우대금리 : {{ depositRecomendations[randomnumber1].depositProductMaxRate }} %
                      </div>
                      <div class="text-sm">
                        기간 : {{ depositRecomendations[randomnumber1].depositProductTerm }}개월
                      </div>
                      <div v-if="depositRecomendations[randomnumber1]" class="mb-4">
                        <a
                          :href="depositRecomendations[randomnumber1].depositProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>

                  <div class="mt-3"></div>
                  <div v-if="depositRecomendations[randomnumber2]" class="product-item flex items-center mb-2">
                    <img
                      :src="`../../../public/images/bank/${changeName(
                        depositRecomendations[randomnumber2].bankName
                      )}.png`"
                      class="w-12 mr-2"
                    />
                    <span class="text-xs lg:text-base">{{
                      depositRecomendations[randomnumber2].depositProductName
                    }}</span>
                  </div>
                  <div v-if="depositRecomendations[randomnumber2]" class="flex flex-col items-end mr-2">
                    <div class="text-sm">
                      최고 우대금리 : {{ depositRecomendations[randomnumber2].depositProductMaxRate }} %
                    </div>
                    <div class="text-sm">기간: {{ depositRecomendations[randomnumber2].depositProductTerm }}개월</div>
                    <div v-if="depositRecomendations[randomnumber2]">
                      <a
                        :href="depositRecomendations[randomnumber2].depositProductUrl"
                        target="_blank"
                        class="text-xs text-primary lg:text-sm"
                        @click.stop
                        >홈페이지 방문하기</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="flex-1 mr-4 border border-gray-300 p-4 rounded-lg"> -->
              <div class="product-container lg:flex-1 mb-0">
                <p class="pb-3 border-bottom font-semibold">적금상품</p>
                <div class="px-2">
                  <div class="border-bottom mt-3">
                    <div v-if="savingsRecommendations[randomnumber3]" class="product-item flex items-center mb-2">
                      <img
                        :src="`../../../public/images/bank/${changeName(
                          savingsRecommendations[randomnumber3].bankName
                        )}.png`"
                        class="w-12 mr-2"
                      />
                      <span class="text-xs lg:text-base">{{
                        savingsRecommendations[randomnumber3].savingsProductName
                      }}</span>
                    </div>
                    <div v-if="savingsRecommendations[randomnumber3]" class="flex flex-col items-end mr-2">
                      <div class="text-sm">
                        최고 우대금리 : {{ savingsRecommendations[randomnumber3].savingsProductMaxRate }} %
                      </div>
                      <div class="text-sm">
                        기간 : {{ savingsRecommendations[randomnumber3].savingsProductTerm }}개월
                      </div>
                      <div v-if="savingsRecommendations[randomnumber3]" class="mb-4">
                        <a
                          :href="savingsRecommendations[randomnumber3].savingsProductUrl"
                          target="_blank"
                          class="text-xs text-primary lg:text-sm"
                          @click.stop
                          >홈페이지 방문하기</a
                        >
                      </div>
                    </div>
                  </div>

                  <div class="mt-3"></div>
                  <div v-if="savingsRecommendations[randomnumber4]" class="product-item flex items-center mb-2">
                    <img
                      :src="`../../../public/images/bank/${changeName(
                        savingsRecommendations[randomnumber4].bankName
                      )}.png`"
                      class="w-12 mr-2"
                    />
                    <span class="text-xs lg:text-base">{{
                      savingsRecommendations[randomnumber4].savingsProductName
                    }}</span>
                  </div>
                  <div v-if="savingsRecommendations[randomnumber4]" class="flex flex-col items-end mr-2">
                    <div class="text-sm">
                      최고 우대금리 : {{ savingsRecommendations[randomnumber4].savingsProductMaxRate }} %
                    </div>
                    <div class="text-sm">기간: {{ savingsRecommendations[randomnumber4].savingsProductTerm }}개월</div>
                    <div v-if="savingsRecommendations[randomnumber4]">
                      <a
                        :href="savingsRecommendations[randomnumber4].savingsProductUrl"
                        target="_blank"
                        class="text-xs text-primary lg:text-sm"
                        @click.stop
                        >홈페이지 방문하기</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 현재 위치를 나타내는 점 추가 -->
        <div class="flex justify-center mt-4">
          <span v-if="currentSlide === 1" class="dot w-3 h-3 bg-indigo-300 rounded-full mr-2"></span>
          <span v-else class="dot w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>

          <span v-if="currentSlide === 0" class="dot w-3 h-3 bg-indigo-300 rounded-full"></span>
          <span v-else class="dot w-3 h-3 bg-indigo-600 rounded-full"></span>
        </div>
      </div>

      <!-- 연령대별 총자산 비교 섹션 -->
      <div class="section-style col-span-1 lg:order-3 lg:ml-2">
        <div class="section-title pb-2 border-bottom">연령대별 자산 비교</div>
        <div class="mt-4 px-4">
          <div>
            <span class="blue-bold">{{ ageRange }}</span> 대 사용자 중 상위 <span class="blue-bold">{{ rank }}</span> %
            입니다.<br />
          </div>
          <div class="mt-2">
            <span class="blue-bold">{{ ageRange }}</span> 대 평균 자산은
            <span class="blue-bold">{{ avgAsset.toLocaleString() }}</span> 원 입니다.
          </div>
        </div>

        <!--삼각형 그리기 -->
        <div class="flex justify-center items-center h-64 relative mt-8">
          <div class="triangle-container relative">
            <div class="triangle"></div>

            <div class="rank-line absolute w-full h-0.5 bg-red-500" :style="{ top: `${rank}%` }"></div>
            <div
              class="rank-text absolute whitespace-nowrap text-black text-sm"
              :style="{ top: `${rank}%`, left: 'calc(100% + 5px)', transform: 'translateY(-50%)' }"
            >
              상위 {{ rank }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import AssetApi from '@/api/AssetApi';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation'; // Chart.js annotation 플러그인
Chart.register(annotationPlugin);

const clickedValue = ref(null); // 클릭된 값
const clickedLabel = ref('');
const clikedValance = ref(null);
const show = ref(false); // 말풍선 표시 여부
const tooltipX = ref(0); // 말풍선 X 좌표
const tooltipY = ref(0); // 말풍선 Y 좌표
const showValue = (event, value, previousPercentage, label) => {
  clickedValue.value = value;
  clickedLabel.value = label;
  show.value = true;
  // 마우스 클릭 위치 계산 (말풍선 위치)
  const chartWidth = event.target.parentElement.offsetWidth; // 차트의 전체 너비
  let prev = 0;
  if (previousPercentage == 0) {
    prev = 0;
    clikedValance.value = totalCashBalance;
  } else if (previousPercentage == 1) {
    prev = cashPercentage.value;
    clikedValance.value = totalDepositSavingsBalance;
  } else {
    prev = Number(cashPercentage.value) + Number(depositSavingsPercentage.value);
    clikedValance.value = totalEtcBalance;
  }
  const offsetX = (prev * chartWidth) / 100; // 이전 막대들의 너비
  tooltipX.value = event.clientX - event.target.getBoundingClientRect().left + offsetX;
  tooltipY.value = event.clientY - event.target.getBoundingClientRect().top - 30; // 클릭 위치보다 위로 배치
};

//이미지 이름 변경
const changeName = (name) => {
  if (name == '경남은행') {
    return 'Gyeongnam';
  } else if (name == '광주은행') {
    return 'Gwangju';
  } else if (name == '부산은행') {
    return 'Busan';
  } else if (name == '산업은행') {
    return 'IndustrialBank';
  } else if (name == '새마을금고은행') {
    return 'SaemaulGeumgo';
  } else if (name == '수협은행') {
    return 'Suhyup';
  } else if (name == '신한은행') {
    return 'Shinhan';
  } else if (name == '신협은행') {
    return 'Shinhyup';
  } else if (name == '씨티은행') {
    return 'Citi';
  } else if (name == '우리은행') {
    return 'Woori';
  } else if (name == '우체국은행') {
    return 'PostOfficeBank';
  } else if (name == '전북은행') {
    return 'Jeonbuk';
  } else if (name == '제주은행') {
    return 'Jeju';
  } else if (name == '카카오뱅크') {
    return 'KakaoBank';
  } else if (name == '하나은행') {
    return 'Hana';
  } else if (name == '기업은행') {
    return 'IBK';
  } else if (name == 'IM') {
    return 'IM';
  } else if (name == 'K뱅크') {
    return 'KBank';
  } else if (name == '국민은행') {
    return 'KB';
  } else if (name == '농협은행') {
    return 'NH';
  }
};

//총 자산 분석
const totalBalance = ref('');
const totalCashBalance = ref('');
const totalDepositSavingsBalance = ref('');
const totalEtcBalance = ref('');

// 총 자산 비율 계산하는 computed
const cashPercentage = computed(() => {
  return ((totalCashBalance.value / totalBalance.value) * 100).toFixed(2);
});

const depositSavingsPercentage = computed(() => {
  return ((totalDepositSavingsBalance.value / totalBalance.value) * 100).toFixed(2);
});

const etcPercentage = computed(() => {
  // console.log(totalEtcBalance.value);
  return ((totalEtcBalance.value / totalBalance.value) * 100).toFixed(2);
});

const getAnalysis = async () => {
  try {
    const response = await AssetApi.showAnalysis();
    totalBalance.value = response.totalBalance;
    totalCashBalance.value = response.totalCashBalance;
    totalDepositSavingsBalance.value = response.totalDepositSavingsBalance;
    totalEtcBalance.value = response.totalEtcBalance;
  } catch (error) {
    // console.error("API 호출 중 오류 발생:", error);
  }
};

//소비 분석 부분

const spendings = reactive({});
const selectedYear = ref(new Date().getFullYear()); // 현재 연도로 기본 설정
const availableYears = ref([2022, 2023, 2024]); // 선택 가능한 년도 리스트

// 현재 월을 계산
const currentMonth = new Date().getMonth() + 1; // 0부터 시작하므로 1을 더함

const getSpendingPatterns = async () => {
  try {
    const response = await AssetApi.showSpendingPatterns(selectedYear.value);
    spendings.previousMonthDiff = response.previousMonthDiff;

    // selectedYear가 현재 연도인 경우 currentMonth에 해당하는 개수만큼 데이터 수집
    // 이전 연도인 경우 12개월 모두 수집
    if (selectedYear.value === new Date().getFullYear()) {
      spendings.monthlySum = response.monthlySum.slice(0, currentMonth);
    } else {
      spendings.monthlySum = response.monthlySum; // 전체 12개월 데이터 사용
    }
    spendings.monthlyAverage = response.monthlyAverage;
    renderChart();
  } catch (error) {
    //  console.error("API 호출 중 오류 발생:", error);
  }
};
let spendingChart; // 차트 인스턴스를 전역적으로 저장

const renderChart = () => {
  const ctx = document.getElementById('spendingChart').getContext('2d');

  // 이전 차트가 존재하면 파괴
  if (spendingChart) {
    spendingChart.destroy();
  }

  // 현재 월을 기준으로 색상을 동적으로 설정
  const barColors = Array.from({ length: currentMonth }, (_, i) => (i === currentMonth - 1 ? '#3F40FF' : '#8485FF'));

  // 새 차트 생성
  spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(
        {
          length: selectedYear.value === new Date().getFullYear() ? currentMonth : 12,
        },
        (_, i) => `${i + 1}월`
      ),
      datasets: [
        {
          label: '',
          data: spendings.monthlySum, // 현재 월까지의 데이터만 사용
          backgroundColor: barColors, // 막대 색상 설정
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 차트의 비율 유지 안 함
      scales: {
        y: {
          beginAtZero: true,
          display: false,
          grid: {
            display: false, // 격자 지우기
          },
          ticks: {
            display: false, // Y축 숫자 제거
          },
        },
        x: {
          grid: {
            display: false, // 격자 지우기
          },
          ticks: {
            max: currentMonth + 0.5, // X축에 여백 추가
          },
          offset: true,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
        },
      },
      plugins: {
        legend: {
          display: false, // 범례 숨기기
        },
        annotation: {
          annotations: {
            averageLine: {
              type: 'line',
              scaleID: 'y',
              value: spendings.monthlyAverage, // 평균 값
              borderColor: 'red',
              borderWidth: 2,
            },
            label1: {
              type: 'label',
              xValue: 1.3,
              yValue: spendings.monthlyAverage,
              yAdjust: -9,
              content: '평균: ' + spendings.monthlyAverage.toLocaleString() + '원',
              font: {
                size: 14,
              },
            },
          },
        },
      },
      // 막대의 너비를 줄이기 위한 옵션
      barPercentage: 0.7, // 막대 너비 (기본값보다 좁게 설정)
      categoryPercentage: 0.5, // 카테고리 너비 조정 (막대 사이 간격 추가)
    },
  });
};

//상품 번호 무작위화
const randomnumber1 = ref('');
const randomnumber2 = ref('');
const randomnumber3 = ref('');
const randomnumber4 = ref('');
const getRandomRecommendations = () => {
  randomnumber1.value = Math.floor(Math.random() * 6) + 2; // 2부터 7까지
  randomnumber2.value = Math.floor(Math.random() * 6) + 2;
  randomnumber3.value = Math.floor(Math.random() * 6) + 2;
  randomnumber4.value = Math.floor(Math.random() * 6) + 2;
};

// 예·적금 추천 상품
const depositRecomendations = reactive([]); // 예금 상품
const savingsRecommendations = reactive([]); //적금상품
const bankNames = {
  1: '국민은행',
  2: '신한은행',
  3: '기업은행',
  4: '우리은행',
  5: '농협은행',
  6: '하나은행',
};
const getProductRecommendations = async () => {
  try {
    const response = await AssetApi.showProductRecommendations();
    //   console.log(response);
    for (let i = 0; i < 8; i++) {
      // depositRecomendations에 은행 이름 추가
      const depositBankId = response.depositRecommendations[i].bankId;
      depositRecomendations[i] = {
        ...response.depositRecommendations[i],
        bankName: bankNames[depositBankId] || '알 수 없는 은행', // bankId가 1~6 외의 값일 경우 기본값
      };

      // savingsRecommendations에 은행 이름 추가
      const savingsBankId = response.savingsRecommendations[i].bankId;
      savingsRecommendations[i] = {
        ...response.savingsRecommendations[i],
        bankName: bankNames[savingsBankId] || '알 수 없는 은행',
      };
    }

    getRandomRecommendations();
  } catch (error) {
    //   console.error("API 호출 중 오류 발생:", error);
  }
};

// 슬라이드 인덱스 관리
const currentSlide = ref(0);
const slideFlag = ref(false);
const slideLeft = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
    slideFlag.value = true;
    scrollToSlide(currentSlide.value);
  }
};

const slideRight = () => {
  if (currentSlide.value < 1) {
    currentSlide.value++;
    slideFlag.value = true;
    scrollToSlide(currentSlide.value);
  }
};

const updateSide = (index) => {
  if (slideFlag.value == false) {
    if (index == 0) {
      currentSlide.value = 1;
    } else {
      currentSlide.value = 0;
    }
  } else {
    slideFlag.value = false;
  }
};

const scrollToSlide = (index) => {
  const carousel = document.querySelector('.recommendation-carousel');
  const slideWidth = carousel.clientWidth;
  carousel.scrollTo({
    left: slideWidth * index,
    behavior: 'smooth',
  });
};

//연령대별 비교
const rank = ref('');
const totalSameUser = ref('');
const ageRange = ref('');
const avgAsset = ref('');

const getAgeComparison = async () => {
  try {
    const response = await AssetApi.showAgeComparison();

    rank.value = response.rank;
    totalSameUser.value = response.totalSameAgeRangeUsers;
    ageRange.value = response.ageRange;
    avgAsset.value = response.avgAsset;
    // 그래프를 그리는 로직
    drawTriangleGraph();
  } catch (error) {
    //    console.error("API 호출 중 오류 발생:", error);
  }
};

const drawTriangleGraph = () => {
  const triangleHeight = 300; // 삼각형의 높이
  const rankPercentage = rank.value; // 순위가 상위 몇 퍼센트인지

  const rankPosition = ((100 - rankPercentage) / 100) * triangleHeight; // 퍼센트에 맞는 위치 계산

  const rankLine = document.getElementById('rankLine');
  const rankText = document.getElementById('rankText');

  // rankPosition에 맞춰 선과 텍스트 위치 설정
  rankLine.style.top = `${rankPosition}px`;
  rankText.style.top = `${rankPosition - 8}px`;
  rankText.style.left = `${rankPosition - 50}px`;
  rankText.textContent = `상위 ${rankPercentage}%`;
};

onMounted(() => {
  getAnalysis();
  getSpendingPatterns();
  getProductRecommendations();
  getAgeComparison();
});
</script>

<style scoped>
/* 상품 추천 css */
.recommendation-carousel {
  display: flex;
  overflow: hidden; /* 슬라이드 바 숨기기 */
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none; /* IE 및 Edge에서 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
}

/* 캐러셀 스타일 */
.recommendation-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  transition: transform 0.5s ease;
}

.triangle-container {
  width: 200px;
  height: 173.21px;
  position: relative;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 173.21px solid #8485ff;
}

.rank-line {
  left: 0;
  right: 0;
}

.rank-text {
  margin-left: 10px;
}
</style>

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBankStore = defineStore('bank', () => {
    const selectedBank = ref(null); // 선택된 은행을 저장할 상태

    // 선택된 은행을 설정하는 함수
    const setSelectedBank = (bankName) => {
        selectedBank.value = bankName; // 선택된 은행 이름 저장
    };

    // 선택된 은행을 가져오는 함수
    const getSelectedBank = () => {
        return selectedBank.value; // 현재 선택된 은행 이름 반환
    };

    //은행 코드를 가져오는 함수
    const getSelectedBankNum = () =>{
        if(selectedBank.value == '국민은행'){
            return '0004';
        }
        else if(selectedBank.value == '신한은행'){
            return '0088';
        }
        else if(selectedBank.value == 'IBK기업은행'){
            return '0003';
        }
        else if(selectedBank.value == '우리은행'){
            return '0020';
        }
        else if(selectedBank.value == '농협은행'){
            return '0011';
        }
        else if(selectedBank.value == '하나은행'){
            return '0081';
        }
    }

    return { selectedBank, setSelectedBank, getSelectedBank, getSelectedBankNum };
});

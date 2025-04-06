// 초성 (19개)
const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
  'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
  'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 중성 (21개)
const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
  'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
  'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];

// 종성 (28개, 첫 번째 요소는 받침 없음)
const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
  'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
  'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
  'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 겹모음 분해 (7종류)
const complexVowels = {
  'ㅘ': ['ㅗ', 'ㅏ'], 'ㅙ': ['ㅗ', 'ㅐ'], 'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'], 'ㅞ': ['ㅜ', 'ㅔ'], 'ㅟ': ['ㅜ', 'ㅣ'],
  'ㅢ': ['ㅡ', 'ㅣ']
};

// 겹모음 조합 (7종류)
const complexVowelsReverse = {
  'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ',
  'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ',
  'ㅡㅣ': 'ㅢ'
};

// 겹자음 분해 (11종류)
const complexConsonants = {
  'ㄳ': ['ㄱ', 'ㅅ'], 'ㄵ': ['ㄴ', 'ㅈ'], 'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'], 'ㄻ': ['ㄹ', 'ㅁ'], 'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'], 'ㄾ': ['ㄹ', 'ㅌ'], 'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'], 'ㅄ': ['ㅂ', 'ㅅ']
};

// 겹자음 조합 (11종류)
const complexConsonantsReverse = {
  'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ',
  'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ',
  'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ',
  'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ'
};

//분해 메서드
function decomposeHangul(hangulWord) {
  let hangulStr = '';

  const ga = 44032; //'가'

  for (let i = 0; i < hangulWord.length; i++) {
    let uni = hangulWord[i].charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588); //초성 인덱스
    let sn = parseInt((uni - (fn * 588)) / 28); //중성 인덱스
    let tn = parseInt(uni % 28); //종성 인덱스

    // 초성 (겹자음 없음)
    hangulStr += f[fn];

    // 중성
    const vowel = s[sn];
    if (complexVowels[vowel]) {
      hangulStr += complexVowels[vowel][0];
      hangulStr += complexVowels[vowel][1];
    } else {
      hangulStr += vowel;
    }

    // 종성
    if (tn !== 0) {
      const final = t[tn];
      if (complexConsonants[final]) {
        hangulStr += complexConsonants[final][0];
        hangulStr += complexConsonants[final][1];
      } else {
        hangulStr += final;
      }
    }
  }

  return hangulStr;
}



//조합 메서드
function composeHangul(letters) {
  if (letters.length === 0) return "";

  let first = null, second = null, third = null;
  var result = "";

  for (let i = 0; i < letters.length; i++) {
    var letter = letters[i];

    //자음
    if (f.includes(letter)) {
      if (first === null) {
        first = f.indexOf(letter);
      } 
      
      else if (second !== null && third === null) {
        /**다음문자 존재 */
        if (i + 1 < letters.length) {
          var nextLetter = letters[i + 1];
          if (f.includes(nextLetter)) third = t.indexOf(letter);
          else if (s.includes(nextLetter)) {
            result += String.fromCharCode(0xAC00 + (first * 588) + (second * 28) + (third ?? 0));
            first = f.indexOf(letter);
            second = null;
            third = null;
          }
        } else { /**letter : 마지막 문자 */
          third = t.indexOf(letter);
        }
      }

      else if (second !== null && third !== null) {
        /**다음문자 존재 */
        if (i + 1 < letters.length) {
          var nextLetter = letters[i + 1];
          if (f.includes(nextLetter)) {
            var complexConsonant = complexConsonantsReverse[t[third] + letter];
            third = t.indexOf(complexConsonant);
            result += String.fromCharCode(0xAC00 + (first * 588) + (second * 28) + (third ?? 0));
            first = null;
            second = null;
            third = null;
          } 
          else if (s.includes(nextLetter)) {
            result += String.fromCharCode(0xAC00 + (first * 588) + (second * 28) + (third ?? 0));
            first = f.indexOf(letter);
            second = null;
            third = null;
          }
        } else { /**letter : 마지막 문자 */
          var complexConsonant = complexConsonantsReverse[t[third] + letter];
          third = t.indexOf(complexConsonant);
          result += String.fromCharCode(0xAC00 + (first * 588) + (second * 28) + (third ?? 0));
          first = null;
          second = null;
          third = null;
        }
      }

      /**
       * 1. first !== null && second === null && third === null
       * 2. first !== null && second === null && third !== null
       */
      else {
        console.log("잘못된 입력 입니다.");
        return "wrong!";
      }

    }


    //모음
    if (s.includes(letter)) {
      if (second === null) {
        second = s.indexOf(letter);
      } else {
        if (complexVowelsReverse[s[second] + letter]) {
          var complexVowel = complexVowelsReverse[s[second] + letter];
          second = s.indexOf(complexVowel);
        } else {
          console.log("겹모음이 될 수 없습니다! : 잘못된 입력입니다.");
          return "wrong!";
        }
      }
    }

  }

  /**마지막 문자 조합하기 */
  result += String.fromCharCode(0xAC00 + (first * 588) + (second * 28) + (third ?? 0));
  first = null;
  second = null;
  third = null;


  // "ꯤ : 잘못된 입력입니다."
  if (String.fromCharCode(44004) === result) {
    console.log("ꯤ : 잘못된 입력입니다.");
    return "wrong!";
  }

  return result;
}




// const answerList = [
//   "단수", "사람", "학교", "사과", "사랑", "기억", "가을", "바람", "비빔", "편지", 
//   "농구", "하늘", "열차", "이불", "부엌", "가방", "이상", "수박", "아침", "저녁",
//   "진주", "가위", "벽지", "주택", "비행", "어린", "도넛", "사탕", "수건", "후회",
//   "공기", "무한", "상자", "교육", "게임", "유학", "축구", "커플", "동기", "격차", 
//   "시작", "쿠폰", "사진", "이윤", "친구", "동료", "연주", "자음", "모음", "이불",
//   "희망", "의지", "의자", "윤리", "도덕", "수학", "국어", "육지", "공기", "기술",
//   "인수", "반지", "의료", "경매", "공수", "미국", "미용", "인사", "정치", "경주",
//   "안타", "죽비", "상사", "중사", "이병", "대장", "중대", "연대", "공사", "회사",
//   "학사", "석사", "박사", "선서", "건배", "바위", "동사", "개회", "폐회", "도형"
// ];


// function includeData(letters) {
//   //자모음으로 이루어진 문자열

//   /**자모음 문자열 => 단어 */
//   var hangulWord = composeHangul(letters);

//   return answerList.includes(hangulWord);
// }


// hangulWord = "바위";
// hangulStr = decomposeHangul(hangulWord);
// console.log("테스트 단어 :", hangulWord)
// console.log("자모 분해:", hangulStr); 
// console.log("재조합:", composeHangul(hangulStr));
// console.log("데이터에 존재하는가?: ", includeData(hangulStr));
// console.log("------------------------------------");
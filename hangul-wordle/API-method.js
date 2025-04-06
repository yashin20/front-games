/**"한국어 기초 사전"에 존재하는 단어인지 확인 (외부 API) */
async function isValidWord(word) {
  const apiKey = "71C8BCE8C0DA93F0A839DF8C726B270C"; // 🚨 API 키 입력
  const url = `https://krdict.korean.go.kr/api/search?key=${apiKey}&q=${encodeURIComponent(word)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API 요청 실패");

    const xmlData = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    // ✅ 검색된 단어 개수 가져오기
    const total = parseInt(xmlDoc.querySelector("total")?.textContent || "0", 10);

    // ✅ 검색 결과가 존재하지 않으면 false 반환
    if (total === 0) return false;

    // ✅ 첫 번째 item의 word 값을 가져오기
    const firstWord = xmlDoc.querySelector("item > word")?.textContent || "";

    // ✅ 첫 번째 검색 결과가 입력 단어와 정확히 일치하는지 확인
    return firstWord === word;
  } catch (error) {
    console.error("🚨 API 요청 중 에러 발생:", error);
    return false;
  }
}
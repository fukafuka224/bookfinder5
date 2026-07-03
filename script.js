let map;
let places;

window.onload = function () {

    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 5
    });

    places = new kakao.maps.services.Places();
};

async function searchAll() {

    const keyword = document.getElementById("searchInput").value.trim();
    const region = document.getElementById("regionInput").value.trim();
    const result = document.getElementById("result");
    const map = document.getElementById("map");

    if (!keyword || !region) {
        result.innerHTML = "<p>📚 책과 지역을 모두 입력해줘!</p>";
        return;
    }

    result.innerHTML = "<p>🌿 검색 중...</p>";

    // 📚 1. 책 검색 (알라딘 API)
    try {

        const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            result.innerHTML = "<p>😥 책을 찾을 수 없어요</p>";
            return;
        }

        const book = data.items[0];

        map.style.display="block";

        result.innerHTML = `
            <div class="book">

                <img src="${book.cover}" />

                <h2>${book.title}</h2>

                <p>✍ ${book.author}</p>

                <p>💰 ${Number(book.price).toLocaleString()}원</p>

                <div class="buttons">

                    <a class="aladin" href="${book.link}" target="_blank">📕 알라딘</a>

                    <a class="yes24" href="https://www.yes24.com/Product/Search?query=${encodeURIComponent(keyword)}" target="_blank">📘 예스24</a>

                    <a class="kyobo" href="https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(keyword)}" target="_blank">📗 교보문고</a>

                </div>

            </div>
        `;

    } catch (err) {
        map.style.display="none";
        result.innerHTML = "<p>⚠️ 책 검색 실패</p>";
        return;
    }

    // 📍 2. 지역 서점 검색 (카카오 지도 API)
    places.keywordSearch(`${region} 서점`, function (data, status) {

        if (status === kakao.maps.services.Status.OK) {

            showPlaces(data);

        } else {

            alert("서점 검색 실패 😢");
        }

    });
}

// 🗺️ 지도에 마커 표시
function showPlaces(placesData) {

    const bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < placesData.length; i++) {

        const place = placesData[i];

        const position = new kakao.maps.LatLng(place.y, place.x);

        new kakao.maps.Marker({
            map: map,
            position: position
        });

        bounds.extend(position);
    }

    map.setBounds(bounds);
}

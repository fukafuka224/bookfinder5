export default async function handler(req, res) {

    const keyword = req.query.q;

    if (!keyword) {
        return res.status(400).json({
            error: "검색어가 없습니다."
        });
    }

    const apiKey = process.env.ALADIN_API_KEY;

    const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${apiKey}&Query=${encodeURIComponent(keyword)}&QueryType=Keyword&MaxResults=10&SearchTarget=Book&output=js&Version=20131101`;

    try {

       const response = await fetch(url);
const text = await response.text();

const data = JSON.parse(
    text.replace(/<.*?>/g, "")
);

        const items = (data.item || []).map(book => ({
            title: book.title,
            author: book.author,
            price: book.priceStandard,
            cover: book.cover,
            link: book.link
        }));

        return res.status(200).json({ items });

    } catch (error) {

        return res.status(500).json({
            error: "검색 실패"
        });

    }
}

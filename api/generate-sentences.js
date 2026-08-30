const SENTENCE_COUNT = 10;
const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_ALLOWED_ORIGINS = [
    'https://kayhuynhkaichou.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
];

function getAllowedOrigins() {
    const configured = (process.env.ALLOWED_ORIGINS || '').split(',')
        .map((origin) => origin.trim()).filter(Boolean);
    return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function setCorsHeaders(request, response) {
    const origin = request.headers.origin;
    if (origin && getAllowedOrigins().has(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Vary', 'Origin');
    }
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Cache-Control', 'no-store');
}

function buildPrompt(term, definition, sourceLanguage) {
    return `Bạn là trợ lý tạo câu ví dụ ${sourceLanguage}.

Chuỗi từ vựng: ${term}
Nghĩa/gợi ý: ${definition}

Chuỗi trên có thể chứa nhiều từ vựng ngăn cách bởi dấu " - ", kèm phiên âm IPA và loại từ. Bỏ qua phiên âm và loại từ, chỉ lấy từ gốc. Dấu gạch ngang nằm trong một từ, ví dụ "well-known", không phải dấu phân tách.

Hãy tạo ĐÚNG ${SENTENCE_COUNT} câu ví dụ bằng ${sourceLanguage}, chia đều cho các từ tìm được. Câu phải đúng ngữ pháp, tự nhiên, dài vừa phải và thể hiện rõ nghĩa của từ.

Format JSON array:
[{"word":"từ gốc","sentence":"câu ${sourceLanguage}","translation":"nghĩa tiếng Việt của câu"}]

Chỉ trả về JSON array, không giải thích thêm.`;
}

function validateRequest(body) {
    const term = typeof body?.term === 'string' ? body.term.trim() : '';
    const definition = typeof body?.definition === 'string' ? body.definition.trim() : '';
    const sourceLanguage = body?.sourceLanguage;
    if (!term || term.length > 500) return { error: 'Từ vựng phải có từ 1 đến 500 ký tự.' };
    if (definition.length > 1000) return { error: 'Nghĩa từ vựng không được vượt quá 1000 ký tự.' };
    if (!['tiếng Anh', 'tiếng Nhật'].includes(sourceLanguage)) return { error: 'Ngôn ngữ không được hỗ trợ.' };
    return { term, definition, sourceLanguage };
}

function parseSentences(payload) {
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('INVALID_GEMINI_RESPONSE');
    const cleanText = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const sentences = JSON.parse(cleanText);
    if (!Array.isArray(sentences) || sentences.length < SENTENCE_COUNT) {
        throw new Error(sentences?.length === 0 ? 'EMPTY_RESULT' : 'INVALID_SENTENCE_COUNT');
    }
    return sentences.slice(0, SENTENCE_COUNT).map((item) => {
        const word = typeof item.word === 'string' ? item.word.trim() : '';
        const sentence = typeof item.sentence === 'string' ? item.sentence.trim() : '';
        const translation = typeof item.translation === 'string' ? item.translation.trim() : '';
        if (!word || !sentence || !translation) throw new Error('INVALID_SENTENCE');
        return { word, sentence, translation };
    });
}

export default async function handler(request, response) {
    setCorsHeaders(request, response);
    if (request.method === 'OPTIONS') return response.status(204).end();
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

    const origin = request.headers.origin;
    if (origin && !getAllowedOrigins().has(origin)) {
        return response.status(403).json({ error: 'Origin không được phép.' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return response.status(500).json({ error: 'Server chưa được cấu hình Gemini API key.' });
    }

    const input = validateRequest(request.body);
    if (input.error) return response.status(400).json({ error: input.error });

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    try {
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(input.term, input.definition, input.sourceLanguage) }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });
        if (!geminiResponse.ok) {
            const status = geminiResponse.status === 429 ? 429 : 502;
            return response.status(status).json({
                error: status === 429 ? 'Gemini đã hết quota. Hãy thử lại sau.' : 'Gemini API đang gặp lỗi.'
            });
        }
        return response.status(200).json({ sentences: parseSentences(await geminiResponse.json()) });
    } catch (error) {
        if (error.message === 'EMPTY_RESULT') {
            return response.status(422).json({ error: 'Gemini không tạo được câu nào.', code: 'EMPTY_RESULT' });
        }
        if (error.message === 'INVALID_SENTENCE_COUNT') {
            return response.status(502).json({ error: 'Gemini chưa trả về đủ 10 câu. Hãy thử lại.' });
        }
        return response.status(502).json({ error: 'Không thể xử lý phản hồi từ Gemini.' });
    }
}


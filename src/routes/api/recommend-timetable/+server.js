// c:/vistavie/hy-portfolio/src/routes/api/recommend-timetable/+server.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';
import courses from '$lib/server/courses.json';

// TODO: Replace with your actual API key from environment variables or secrets
const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST({ request }) {
    try {
        const { user_input } = await request.json();

        if (!user_input) {
            return json({ error: 'User input is required.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            사용자의 요청에 따라 AI 기반 시간표를 추천해줘.
            다음은 현재 수강 가능한 과목 목록이야:
            ${JSON.stringify(courses, null, 2)}

            사용자 요청: "${user_input}"

            위 과목 목록에서 사용자의 요청에 맞는 과목들을 선택하여 시간표를 구성해줘.
            시간표는 다음 JSON 배열 형식으로 반환해줘:
            [
                {
                    "day": "월요일",
                    "time": "09:00-10:30",
                    "activity": "활동 내용 (예: 교육방법 및 교육공학)"
                },
                {
                    "day": "월요일",
                    "time": "11:00-12:00",
                    "activity": "활동 내용 (예: 교육심리)"
                }
            ]
            반드시 JSON 형식으로만 응답해야 해. 다른 설명은 포함하지 마.
            `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let timetable;
        try {
            // Attempt to find and parse the JSON string.
            const jsonStartIndex = text.indexOf('[');
            const jsonEndIndex = text.lastIndexOf(']');

            if (jsonStartIndex === -1 || jsonEndIndex === -1) {
                throw new Error("No JSON array found in AI response.");
            }

            const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
            timetable = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", text, parseError);
            return json({ error: 'Failed to generate a valid timetable. Please try again.' }, { status: 500 });
        }

        return json({ timetable });

    } catch (error) {
        console.error("Error generating timetable:", error);
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
}

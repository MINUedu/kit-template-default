<!-- c:/vistavie/hy-portfolio/src/routes/timetable/+page.svelte -->
<script>
    import { useState } from 'svelte'; // Svelte 5 uses runes, but for now, let's use a simple state management
    import { enhance } from '$app/forms';

    let userInput = '';
    let timetable = [];
    let loading = false;
    let error = null;

    async function handleSubmit() {
        loading = true;
        error = null;
        timetable = [];

        try {
            const response = await fetch('/api/recommend-timetable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_input: userInput })
            });

            const result = await response.json();

            if (response.ok) {
                timetable = result.timetable;
            } else {
                error = result.error || '시간표 생성에 실패했습니다.';
            }
        } catch (err) {
            console.error('Fetch error:', err);
            error = '네트워크 오류가 발생했습니다.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">AI 기반 시간표 추천</h1>

    <form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md mb-8">
        <div class="mb-4">
            <label for="user_input" class="block text-gray-700 text-sm font-bold mb-2">
                어떤 시간표를 추천받고 싶으신가요? (예: "주 5일, 매일 9시부터 6시까지 운동, 공부, 휴식 포함")
            </label>
            <textarea
                id="user_input"
                bind:value={userInput}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                placeholder="예: '평일 오전에는 코딩 공부, 오후에는 운동, 저녁에는 취미 활동을 하고 싶어요. 주말에는 자유롭게 보내고 싶습니다.'"
            ></textarea>
        </div>
        <div class="flex items-center justify-between">
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
            >
                {#if loading}
                    시간표 생성 중...
                {:else}
                    시간표 추천받기
                {/if}
            </button>
        </div>
    </form>

    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">오류:</strong>
            <span class="block sm:inline">{error}</span>
        </div>
    {/if}

    {#if timetable.length > 0}
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">추천 시간표</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                요일
                            </th>
                            <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                시간
                            </th>
                            <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                활동
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each timetable as item}
                            <tr class="hover:bg-gray-100">
                                <td class="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                                    {item.day}
                                </td>
                                <td class="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                                    {item.time}
                                </td>
                                <td class="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                                    {item.activity}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Tailwind CSS가 적용되므로 추가적인 스타일은 필요 없을 수 있습니다. */
    /* 필요하다면 여기에 커스텀 스타일을 추가하세요. */
</style>
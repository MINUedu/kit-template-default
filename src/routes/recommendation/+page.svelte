<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";

  let userInput: string = '';
  let recommendedTimetables: any[] = [];
  let isLoading: boolean = false;
  let error: string | null = null;

  async function getTimetableRecommendation() {
    isLoading = true;
    error = null;
    recommendedTimetables = [];

    try {
      const response = await fetch('/api/recommend-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '시간표 추천에 실패했습니다.');
      }

      const data = await response.json();
      recommendedTimetables = data.timetable;

    } catch (e: any) {
      error = e.message;
      console.error("Error fetching timetable:", e);
    } finally {
      isLoading = false;
    }
  }
</script>

<h1 class="text-3xl font-bold mb-6">AI 기반 시간표 추천</h1>

<div class="grid gap-6">
  <Card>
    <CardHeader>
      <CardTitle>나만의 시간표를 AI에게 맡겨보세요!</CardTitle>
      <CardDescription>원하는 시간표의 조건이나 선호도를 자유롭게 입력해주세요.</CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid gap-2">
        <Label for="user-input">시간표 요청</Label>
        <Textarea
          id="user-input"
          placeholder="예: 월요일 오전에 공강이 있었으면 좋겠고, 3학점짜리 전공 과목 위주로 추천해줘. 이동 거리는 짧았으면 좋겠어."
          bind:value={userInput}
          rows={5}
        />
      </div>
      <Button on:click={getTimetableRecommendation} disabled={isLoading}>
        {#if isLoading}
          시간표 추천 중...
        {:else}
          시간표 추천받기
        {/if}
      </Button>
    </CardContent>
  </Card>

  {#if error}
    <div class="text-red-500 p-4 border border-red-500 rounded-md">
      <p>오류: {error}</p>
    </div>
  {/if}

  {#if recommendedTimetables.length > 0}
    <h2 class="text-2xl font-bold mt-8 mb-4">추천 시간표</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each recommendedTimetables as timetable, index (index)}
        <Card>
          <CardHeader>
            <CardTitle>추천 시간표 {index + 1}</CardTitle>
            <CardDescription>AI가 제안하는 시간표입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {#if timetable.length > 0}
              <ul class="list-disc pl-5 space-y-2">
                {#each timetable as item (item.activity)}
                  <li>
                    <span class="font-semibold">{item.day} {item.time}:</span> {item.activity}
                  </li>
                {/each}
              </ul>
            {:else}
              <p>추천된 과목이 없습니다. 조건을 다시 설정해보세요.</p>
            {/if}
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if !isLoading && !error && userInput && recommendedTimetables.length === 0}
    <p class="text-center text-gray-500 mt-8">추천된 시간표가 없습니다. 조건을 다시 설정해보세요.</p>
  {/if}
</div>
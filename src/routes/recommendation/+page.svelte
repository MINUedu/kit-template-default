<script>
  import { onMount } from 'svelte';

  let courses = [];
  let filteredCourses = [];
  let selectedDay = '';
  let selectedCredits = 0;

  onMount(async () => {
    const response = await fetch('/api/courses');
    courses = await response.json();
    filteredCourses = courses;
  });

  $: {
    filteredCourses = courses.filter(course => {
      const dayMatch = selectedDay ? course.day === selectedDay : true;
      const creditsMatch = selectedCredits ? course.credits === selectedCredits : true;
      return dayMatch && creditsMatch;
    });
  }
</script>

<h1 class="text-3xl font-bold mb-6">AI 기반 시간표 추천</h1>

<div class="flex space-x-4 mb-6">
  <div>
    <label for="day-filter" class="block text-sm font-medium text-gray-700">요일 필터:</label>
    <select id="day-filter" bind:value={selectedDay} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
      <option value="">모든 요일</option>
      <option value="월">월요일</option>
      <option value="화">화요일</option>
      <option value="수">수요일</option>
      <option value="목">목요일</option>
      <option value="금">금요일</option>
    </select>
  </div>
  <div>
    <label for="credits-filter" class="block text-sm font-medium text-gray-700">학점 필터:</label>
    <select id="credits-filter" bind:value={selectedCredits} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
      <option value="0">모든 학점</option>
      <option value="1">1학점</option>
      <option value="2">2학점</option>
      <option value="3">3학점</option>
    </select>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each filteredCourses as course (course.id)}
    <div class="bg-white shadow-md rounded-lg p-4">
      <h2 class="text-xl font-semibold">{course.name}</h2>
      <p class="text-gray-600">{course.professor} 교수</p>
      <p class="text-gray-600">{course.day} {course.start_time} - {course.end_time}</p>
      <p class="text-gray-600">{course.credits} 학점</p>
    </div>
  {:else}
    <p>강의를 찾을 수 없습니다.</p>
  {/each}
</div>

import { json } from '@sveltejs/kit';
import courses from '../../../lib/server/courses.json';

export async function GET() {
  return json(courses);
}

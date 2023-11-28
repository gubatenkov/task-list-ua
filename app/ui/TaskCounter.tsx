import { getTasksCount } from '@/app/lib/actions'

export default async function TaskCounter() {
  const totalTaskCount = await getTasksCount()
  return <span className="mx-2 inline-block font-bold">{totalTaskCount}</span>
}

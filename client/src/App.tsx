import { useQuery } from '@tanstack/react-query';
import './App.css'
import { Button } from './components/ui/button'
import { Todo } from './types';
import { Input } from './components/ui/input';
import { PlusIcon } from 'lucide-react';

export default function App() {
  const BASE_URL = "http://localhost:5000"

  // ---------------------------------GET-------------------------------------------
  const { data, isFetching, error: getError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => fetch(`${BASE_URL}/api/todos`).then((res) => res.json()),
  });

  (!isFetching && data) && console.log(data)

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Wash Dishes" />
        <Button type="submit"><PlusIcon /></Button>
      </div>


      <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        {data?.map((item) => (
          <li key={item._id} className="flex items-center">
            {item.body}
          </li>
        ))}
      </ul>
    </>
  )
}

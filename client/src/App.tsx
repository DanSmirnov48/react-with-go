import { useQuery } from '@tanstack/react-query';
import './App.css'
import { Button } from './components/ui/button'
import { Todo } from './types';
import { Input } from './components/ui/input';
import { CheckCircle2, PlusIcon, Trash } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Shell } from './components/shell';

export default function App() {
  // ---------------------------------GET-------------------------------------------
  const { data, isFetching, error: getError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => fetch(`/api/todos`).then((res) => res.json()),
  });

  (!isFetching && data) && console.log(data)

  return (
    <Shell variant={"markdown"}>
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input type="text" placeholder="Wash Dishes" />
        <Button type="submit">
          <PlusIcon />
        </Button>
      </div>

      <br className="mb-20" />

      <div className="flex flex-col space-y-1">
        {data?.map((item) => (
          <div key={item._id} className='flex flex-row space-x-2'>
            <Badge
              variant="outline"
              className="rounded-md px-2 max-w-xs flex justify-between w-full mr-1"
            >
              {item.body}{" "}
              {item.completed ? (
                <span className="bg-green-100">Done</span>
              ) : (
                <span className="bg-red-100 px-2 py-0.5">In Progress</span>
              )}
            </Badge>
            <Button variant={'outline'}><CheckCircle2 className='w-5 h-5' /></Button>
            <Button variant={'outline'}><Trash className='w-5 h-5' /></Button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

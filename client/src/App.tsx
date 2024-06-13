import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import './App.css'
import { Button } from './components/ui/button'
import { Todo } from './types';
import { Input } from './components/ui/input';
import { CheckCircle2, Loader2, PlusIcon, Trash } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Shell } from './components/shell';
import { useState } from 'react';

export default function App() {

  const queryClient = new QueryClient()
  const [newTodo, setNewTodo] = useState("");

  // ---------------------------------GET-------------------------------------------
  const { data, isFetching, error: getError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => fetch(`/api/todos`).then((res) => res.json()),
  });

  (!isFetching && data) && console.log(data)


  // ---------------------------------DELETE-------------------------------------------
  const { mutate: deleteTodo, isPending: LoadingDelete, error: deleteError } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async ({ todoId }: { todoId: number }) =>
      fetch(`/api/todos/${todoId}`, { method: "DELETE", }).then((res) => res.json()),
    onSuccess: async () => {
      console.log("deleted")
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: () => {
      console.log(deleteError)
    },
  });


  // ---------------------------------CREATE-------------------------------------------
  const { mutate: createTodo, isPending: LoadingCreate, error: createError } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newTodo }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setNewTodo("");
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  // ---------------------------------UPDATE-------------------------------------------
  const { mutate: updateTodo, isPending: LoadingUpdate, error: updateError } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async ({ todo }: { todo: Todo }) => {
      if (todo.completed) return alert("Todo is already completed");
      try {
        const res = await fetch(`/api/todos/${todo._id}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      console.log("udpated")
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <Shell variant={"markdown"}>
      <form onSubmit={createTodo} className='flex w-full max-w-md items-center space-x-2'>
        <Input
          type='text'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          ref={(input) => input && input.focus()}
        />
        <Button type='submit'>
          {LoadingCreate ? <Loader2 className='animate-spin' /> : <PlusIcon />}
        </Button>
      </form>

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
                <span className="bg-green-100 py-0.5 px-2">Done</span>
              ) : (
                <span className="bg-red-100 px-2 py-0.5">In Progress</span>
              )}
            </Badge>
            <Button variant={'outline'} onClick={() => updateTodo({ todo: item })}><CheckCircle2 className='w-5 h-5' /></Button>
            <Button variant={'outline'} onClick={() => deleteTodo({ todoId: item._id })}><Trash className='w-5 h-5' /></Button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

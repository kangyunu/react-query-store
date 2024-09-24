# React Query Store

React Query Store is a library that allows you to conveniently create query keys and query function mutations for CRUD operations.

## Installation

```shell
npm install react-query-store
```

## Features

- Define list and detail queries
- Define create, update, and delete mutations
- Convenient query key generation and management

## Example

```Typescript
import { create } from 'react-query-store'
import { useQuery, useMutation, QueryClient } from 'react-query'

// Create store
const store = create({
  root: ["posts"],
  query: {
    list: () => {
      return fetch(`/posts`, { method: "GET" })
    },
    detail: (postId: number) => {
      return fetch(`/posts/${postId}`, { method: "GET" })
    },
    create: (createInput: PostCreateInput) => {
      return fetch(`/posts`, { method: "POST", body: JSON.stringify(createInput) })
    },
    delete: (postId: number) => {
      return fetch(`/posts/${postId}`, { method: "DELETE" })
    },
    update: (postId: number, updateInput: PostUpdateInput) => {
      return fetch(`/posts/${postId}`, { method: "PUT", body: JSON.stringify(updateInput) })
    },
  },
});

// Using queries
const PostList = () => {
  const query = useQuery({
    queryKey: store.key.generator.list(),
    queryFn: () => store.query.list(),
  });
  // ...
}

const PostDetail = ({ postId }) => {
  const query = useQuery({
    queryKey: store.key.generator.detail([postId]),
    queryFn: () => store.query.detail(postId),
  });
  // ...
}

// Using mutations
const CreatePost = () => {
  const mutation = useMutation({
    mutationFn: (createInput: PostCreateInput) => store.query.create(createInput),
  });
  // ...
}

// Query invalidation
const queryClient = new QueryClient();

// Invalidate all queries
queryClient.invalidateQueries({ queryKey: store.key.root });

// Invalidate detail queries
queryClient.invalidateQueries({ queryKey: store.key.base.detail });

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: store.key.generator.detail([postId]) });
```

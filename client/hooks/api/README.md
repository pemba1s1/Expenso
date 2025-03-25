# React Query API Hooks

This directory contains React Query hooks for interacting with the Expenso backend API. These hooks provide a clean and consistent way to fetch, create, update, and delete data from the server.

## Available Hooks

### Authentication Hooks (`useAuth.ts`)

- `useRegister()` - Register a new user
- `useLogin()` - Login a user
- `useVerifyUser()` - Verify a user's email
- `useCurrentUser()` - Get the current authenticated user
- `useLogout()` - Logout the current user
- `useGoogleLogin()` - Redirect to Google login

### Expense Hooks (`useExpense.ts`)

- `useAddExpense()` - Add a new expense
- `useApproveExpense()` - Approve an expense
- `useExpenseSummary()` - Get expense summary for a custom date range
- `useMonthlyExpenseSummary()` - Get monthly expense summary

### Group Hooks (`useGroup.ts`)

- `useCreateGroup()` - Create a new group
- `useUserGroups()` - Get all groups for the current user
- `useGroupById()` - Get a group by ID
- `useGroupUsers()` - Get users in a group

### Invitation Hooks (`useInvitation.ts`)

- `useInviteUser()` - Invite a user to a group
- `useAcceptInvitation()` - Accept an invitation

### User Category Limit Hooks (`useUserCategoryLimit.ts`)

- `useSetUserCategoryLimit()` - Set a spending limit for a user category

## Usage Examples

### Authentication

```tsx
import { useLogin } from '@/hooks/api';

const LoginComponent = () => {
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      {isError && <p>Error: {error.message}</p>}
    </form>
  );
};
```

### Fetching Data

```tsx
import { useUserGroups } from '@/hooks/api';

const GroupsComponent = () => {
  const { data: groups, isLoading, isError, error } = useUserGroups();

  if (isLoading) return <p>Loading groups...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Your Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Creating Data

```tsx
import { useCreateGroup } from '@/hooks/api';

const CreateGroupComponent = () => {
  const { mutate: createGroup, isPending } = useCreateGroup();

  const handleSubmit = (e) => {
    e.preventDefault();
    createGroup({
      name: 'New Group',
      type: 'NORMAL'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
};
```

## Error Handling

All hooks include proper error handling. For mutation hooks, you can access the error state:

```tsx
const { mutate, isError, error } = useLogin();

if (isError) {
  console.error('Login failed:', error.message);
}
```

For query hooks, you can handle loading and error states:

```tsx
const { data, isLoading, isError, error } = useUserGroups();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage message={error.message} />;
```

## Invalidating Queries

After a mutation, you might want to invalidate related queries to refetch the latest data:

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { useAddExpense } from '@/hooks/api';

const ExpenseForm = () => {
  const queryClient = useQueryClient();
  const { mutate } = useAddExpense();

  const handleSubmit = (formData) => {
    mutate(formData, {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
      },
    });
  };
};

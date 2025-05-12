interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
}

function UsernameInput({ username, setUsername }: UsernameInputProps) {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <label htmlFor="username" className="text-sm text-dual-dark">
        Username:{' '}
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={20}
        className="px-2 py-1 text-sm border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-dual-darkest w-[180px] transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:shadow"
      />
    </div>
  );
};

export default UsernameInput;

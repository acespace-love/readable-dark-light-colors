import React from 'react';

interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ username, setUsername }) => {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <label htmlFor="username" className="text-sm">Username: </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={20}
        className="px-2 py-1 text-sm border border-[var(--border-color)] rounded bg-[var(--background)] text-[var(--text-primary)] w-[180px] transition-colors duration-300 focus:outline-none focus:border-[var(--accent-color)] focus:shadow"
      />
    </div>
  );
};

export default UsernameInput;
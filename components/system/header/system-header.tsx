"use client";

import { UserDropdown } from "./user-dropdown";

export const SystemHeader = () => {
  return (
    <div className='flex items-center justify-end'>
      <UserDropdown />
    </div>
  );
};

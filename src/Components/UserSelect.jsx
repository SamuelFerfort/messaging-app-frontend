import { useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import PropTypes from "prop-types";

const UserSelect = ({ allUsers, selectedUsers, setSelectedUsers, error }) => {
  const [inputValue, setInputValue] = useState("");

  if (!allUsers) return null;

  const filteredUsers = allUsers.filter(
    (user) =>
      (
        user.firstName.toLowerCase() +
        " " +
        user.lastName.toLowerCase()
      ).includes(inputValue.toLowerCase()) && !selectedUsers.includes(user),
  );

  const addUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setInputValue("");
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="user-select"
          className="text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          <UserPlus size={18} className="text-gray-500" />
          Add Users to Group
        </label>
        <div className="relative">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              id="user-select"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search users by name..."
              autoComplete="off"
            />
          </div>
          {error && (
            <span className="text-red-500 text-xs mt-1 block">{error}</span>
          )}
          {inputValue && (
            <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <li className="p-3 text-sm text-gray-500 text-center">
                  No users found
                </li>
              ) : (
                filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    onClick={() => addUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                        {user.about && (
                          <div className="text-xs text-gray-500 truncate">
                            {user.about}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Add
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500">
            Selected Users ({selectedUsers.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <span className="max-w-[150px] truncate">
                  {`${user.firstName} ${user.lastName}`}
                </span>
                <button
                  onClick={() => removeUser(user)}
                  className="ml-2 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

UserSelect.propTypes = {
  selectedUsers: PropTypes.array,
  setSelectedUsers: PropTypes.func,
  allUsers: PropTypes.array,
  error: PropTypes.string,
};

export default UserSelect;

import { useState } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const UserSelect = ({ allUsers, selectedUsers, setSelectedUsers, error}) => {
  const [inputValue, setInputValue] = useState("");

 
  if (!allUsers) return;

  const filteredUsers = allUsers.filter(
    (user) =>
      (
        user.firstName.toLowerCase() +
        " " +
        user.lastName.toLowerCase()
      ).includes(inputValue.toLowerCase()) && !selectedUsers.includes(user)
  );

  const addUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setInputValue("");
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <div className="w-full max-w-md ">
      <label
        htmlFor="user-select"
        className="block text-base font-medium text-gray-700 mb-1"
      >
        Add Users
      </label>
      <div className="relative">
        <input
          type="text"
          id="user-select"
          className="w-full p-2 border rounded-md"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type to search users..."
        />
        {error && <span className="text-red-400 italic text-xs">{error}</span>}
        {inputValue && (
          <ul className="absolute z-50 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addUser(user)}
              >
                {`${user.firstName} ${user.lastName}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedUsers.map((user) => (
          <span
            key={user.id}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
          >
            {`${user.firstName} ${user.lastName}`}
            <button
              onClick={() => removeUser(user)}
              className="ml-1 text-blue-800 hover:text-blue-900"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
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

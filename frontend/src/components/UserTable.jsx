import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      showMessage("Failed to fetch users", "error");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const deleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage("User deleted successfully!", "success");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      showMessage("Failed to delete user", "error");
    }
  };

  const toggleUserStatus = async (id, currentStatus, username) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} user: ${username}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/user/toggle-active/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage(
        `User ${action}d successfully!`,
        "success"
      );
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user`, error);
      showMessage(`Failed to ${action} user`, "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">User Management</h2>
        
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">
            Total Users: <span className="text-blue-600">{users.length}</span>
          </p>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Admin (Protected)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 border border-gray-300 text-left">ID</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Username</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Email</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Role</th>
                <th className="px-4 py-3 border border-gray-300 text-center">Status</th>
                <th className="px-4 py-3 border border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 text-lg"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition ${
                      !user.active ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-3">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      {user.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          <span className="w-2 h-2 rounded-full mr-2 bg-purple-500"></span>
                          Admin (Protected)
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              user.active ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {user.role === "ADMIN" ? (
                        <span className="text-gray-500 text-sm italic">
                          Admin - No Actions
                        </span>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              toggleUserStatus(user.id, user.active, user.username)
                            }
                            className={`${
                              user.active
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-500 hover:bg-green-600"
                            } text-white px-4 py-1 rounded-md transition text-sm font-medium`}
                          >
                            {user.active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;

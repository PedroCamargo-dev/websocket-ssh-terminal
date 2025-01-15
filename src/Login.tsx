import React, { useState } from "react";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    host: "127.0.0.1",
    port: 22,
    username: "pedrocamargo",
    password: "Pedro3008@",
    privateKey: "",
  });

  const handleLogin = () => {
    if (!formData.host || !formData.port || !formData.username) {
      return;
    }

    navigate("/terminal", {
      state: { ...formData },
    });
  };

  const handleFormDataChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center font-bold">SSH Login</h1>
        <input
          className="w-full p-2 mb-3 bg-gray-600 rounded"
          type="text"
          placeholder="Host"
          value={formData.host}
          onChange={(e) => handleFormDataChange("host", e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-gray-600 rounded"
          type="number"
          placeholder="Port"
          value={formData.port}
          onChange={(e) => handleFormDataChange("port", e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-gray-600 rounded"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => handleFormDataChange("username", e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 bg-gray-600 rounded"
          type="password"
          placeholder="Password (optional)"
          value={formData.password}
          onChange={(e) => handleFormDataChange("password", e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-3 bg-gray-600 rounded"
          placeholder="Private Key (optional)"
          rows={3}
          value={formData.privateKey}
          onChange={(e) => handleFormDataChange("privateKey", e.target.value)}
        ></textarea>
        <button
          className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export { Login };

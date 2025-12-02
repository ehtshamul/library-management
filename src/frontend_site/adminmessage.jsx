import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllmessages, replyToMessage } from "../store/landing";

export default function AdminDashboardmessage() {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchAllmessages()).unwrap();
        setMessages(res);
      } catch {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const handleSendReply = (id) => {
    if (replyText.trim() === "") {
      alert("Reply cannot be empty");
      return;
    }
    dispatch(replyToMessage({ id, replyText }))
      .unwrap()
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, response: replyText } : msg
          )
        );
        console.log("Reply sent successfully to:", id);
        setReplyingId(null);
        setReplyText("");
      })
      .catch((error) => {
        console.error("Failed to send reply:", error);
        alert("Failed to send reply");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Manage user messages and replies
          </p>
        </div>

        {/* Loader */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-lg">
            Loading messages...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* No messages */}
        {!loading && messages.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            No messages found
          </div>
        )}

        {/* Messages – Responsive */}
        {!loading && messages.length > 0 && (
          <div className="w-full">

            {/* TABLE ON LARGE SCREENS */}
            <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {["Name", "Email", "Phone", "Subject", "Message", "Response", "Action"].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-4 text-left text-sm font-semibold"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {messages.map((msg, index) => (
                    <tr
                      key={msg._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-6 py-4">{msg.name}</td>
                      <td className="px-6 py-4">{msg.email}</td>
                      <td className="px-6 py-4">{msg.phone}</td>
                      <td className="px-6 py-4">{msg.subject}</td>
                      <td className="px-6 py-4 max-w-sm">
                        <div className="line-clamp-2">{msg.message}</div>
                      </td>
                      <td className="px-6 py-4">
                        {msg.response ? (
                          <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                            {msg.response}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs bg-amber-50 text-amber-700 rounded-full">
                            No response
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {replyingId === msg._id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="border rounded p-2 text-sm"
                              rows="2"
                              placeholder="Type reply..."
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSendReply(msg._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingId(msg._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Reply
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE & TABLET CARD VIEW */}
            <div className="lg:hidden space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-white p-4 rounded-xl shadow border border-slate-100"
                >
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {msg.name}
                    </h2>
                    <p className="text-sm text-slate-500">{msg.email}</p>
                  </div>

                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Phone:</strong> {msg.phone}</p>
                    <p><strong>Subject:</strong> {msg.subject}</p>
                    <p><strong>Message:</strong> {msg.message}</p>
                  </div>

                  <div className="mt-3">
                    {msg.response ? (
                      <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                        {msg.response}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-amber-50 text-amber-700 rounded-full">
                        No response
                      </span>
                    )}
                  </div>

                  {/* Reply Box */}
                  <div className="mt-4">
                    {replyingId === msg._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full border rounded p-2 text-sm"
                          rows="2"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendReply(msg._id)}
                            className="flex-1 bg-green-600 text-white p-2 rounded text-sm"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => {
                              setReplyingId(null);
                              setReplyText("");
                            }}
                            className="flex-1 bg-gray-500 text-white p-2 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingId(msg._id)}
                        className="w-full bg-blue-600 text-white p-2 rounded text-sm mt-2"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

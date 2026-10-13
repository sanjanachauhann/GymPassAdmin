import { useEffect, useState } from "react";
import {
  getAdmins,
  createAdmin,
  deleteAdmin,
} from "../api/admin";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentAdmin = JSON.parse(
    localStorage.getItem("adminUser") || "null",
  );

  const loadAdmins = async () => {
    try {
      setLoading(true);

      const data = await getAdmins();

      setAdmins(data.admins || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load admins",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await createAdmin({
        name,
        email,
        role,
      });

      setName("");
      setEmail("");
      setRole("admin");

      setShowForm(false);

      setSuccess(
        "Invitation sent successfully.",
      );

      await loadAdmins();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create admin",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdmin(id);

      setSuccess("Admin deleted successfully.");

      await loadAdmins();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete admin",
      );
    }
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Admin Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage people who have access to GymPass Admin.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
          className="rounded-xl bg-[#23ee09] px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          {showForm ? "Cancel" : "+ Add Admin"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-xl border border-green-900 bg-green-950/40 p-4 text-green-400">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-2xl border border-[#222] bg-[#0D0D0D] p-6"
        >
          <h3 className="text-lg font-semibold">
            Invite New Admin
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            They will receive an email and create their own
            password.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin name"
                required
                className="w-full rounded-xl border border-[#292929] bg-[#080808] px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gympass.com"
                required
                className="w-full rounded-xl border border-[#292929] bg-[#080808] px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-[#292929] bg-[#080808] px-4 py-3 text-white outline-none"
              >
                <option value="admin">Admin</option>

                {currentAdmin?.role === "superadmin" && (
                  <option value="superadmin">
                    Superadmin
                  </option>
                )}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-[#23ee09] px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {saving ? "Sending Invitation..." : "Send Invitation"}
          </button>
        </form>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#222] bg-[#0D0D0D]">
        <div className="border-b border-[#222] px-6 py-5">
          <h3 className="font-semibold">
            Administrators
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading admins...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No admins found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222] text-left text-sm text-gray-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => {
                const isCurrentAdmin =
                  admin.id === currentAdmin?.id ||
                  admin._id === currentAdmin?.id;

                return (
                  <tr
                    key={admin.id || admin._id}
                    className="border-b border-[#1A1A1A]"
                  >
                    <td className="px-7 py-5 font-medium">
                      {admin.name}
                    </td>

                    <td className="px-6 py-5 text-gray-400">
                      {admin.email}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          admin.role === "superadmin"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          admin.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      {!isCurrentAdmin && (
                        <button
                          onClick={() =>
                            handleDelete(
                              admin.id || admin._id,
                            )
                          }
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
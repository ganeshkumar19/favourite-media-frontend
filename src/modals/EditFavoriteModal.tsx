import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "../utils/errors";
import api from "../services/api";
import type { Favorite } from "../types/favorite";

interface Props {
  favorite: Favorite;
  onClose: () => void;
  onSuccess: () => void;
}

const EditFavoriteModal = ({ favorite, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    title: favorite.title,
    type: favorite.type,
    director: favorite.director,
    budget: favorite.budget,
    location: favorite.location,
    duration: favorite.duration,
    yearOrTime: favorite.yearOrTime,
  });

  // Local visibility state to enable exit animation before unmount
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // trigger enter animation on mount
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.put(`/favorites/${favorite.id}`, form);
      onSuccess(); // refresh data
      toast.success("Favorite updated successfully");
      // close with animation
      handleClose();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center " +
        "bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 " +
        (isVisible ? "opacity-100" : "opacity-0")
      }
      aria-modal="true"
      role="dialog"
    >
      <div
        className={
          "w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl " +
          "transition-all duration-200 ease-out " +
          (isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2")
        }
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">✏️ Edit Favorite</h2>
            <button
              type="button"
              onClick={isSubmitting ? undefined : handleClose}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              disabled={isSubmitting}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
              <input
                name="director"
                value={form.director}
                onChange={handleChange}
                placeholder="Enter director name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  name="budget"
                  value={form.budget}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*(?:\.?\d*)?$/.test(v)) setForm({ ...form, budget: v });
                  }}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-md pl-7 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">million</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <div className="relative">
                <input
                  name="duration"
                  value={form.duration}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v)) setForm({ ...form, duration: v });
                  }}
                  placeholder="Enter duration"
                  className="w-full border border-gray-300 rounded-md pr-16 pl-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  inputMode="numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{form.type === 'TV Show' ? 'min/ep' : 'min'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year/Time</label>
              <input
                type="date"
                name="yearOrTime"
                value={(form.yearOrTime || '').slice(0, 10)}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={isSubmitting ? undefined : handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFavoriteModal;

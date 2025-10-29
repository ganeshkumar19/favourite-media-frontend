import { useState } from "react";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "../utils/errors";
import api from "../services/api";

interface Props {
  onAdd: () => void;
}

const FavoriteForm = ({ onAdd }: Props) => {
  const [form, setForm] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    yearOrTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/favorites", form);
      setForm({
        title: "",
        type: "Movie",
        director: "",
        budget: "",
        location: "",
        duration: "",
        yearOrTime: "",
      });
      toast.success("Favorite added successfully");
      onAdd(); // triggers invalidation → refreshes data
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            name="title"
            placeholder="Enter title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Director
          </label>
          <input
            name="director"
            placeholder="Enter director name"
            value={form.director}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              name="budget"
              placeholder="Enter amount"
              value={form.budget}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*(?:\.?\d*)?$/.test(v)) setForm({ ...form, budget: v });
              }}
              className="w-full border border-gray-300 rounded-md pl-7 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              inputMode="decimal"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">million</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <div className="relative">
            <input
              name="duration"
              placeholder="Enter duration"
              value={form.duration}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) setForm({ ...form, duration: v });
              }}
              className="w-full border border-gray-300 rounded-md pr-14 pl-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              inputMode="numeric"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{form.type === 'TV Show' ? 'min/ep' : 'min'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year/Time
          </label>
          <input
            type="date"
            name="yearOrTime"
            placeholder="YYYY-MM-DD"
            value={form.yearOrTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center">
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            Saving...
          </span>
        ) : (
          "Add Favorite"
        )}
      </button>
    </form>
  );
};

export default FavoriteForm;
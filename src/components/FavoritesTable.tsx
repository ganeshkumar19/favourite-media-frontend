import { useState } from "react";
import type { Favorite } from "../types/favorite";
import api from "../services/api";
import EditFavoriteModal from "../modals/EditFavoriteModal";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "../utils/errors";


interface Props {
  favorites: Favorite[];
  onDelete: (id: number) => void;
  onEditSuccess: () => void; // ✅ new prop to refresh data after edit
}

const FavoritesTable = ({ favorites, onDelete, onEditSuccess }: Props) => {
  const [editingFavorite, setEditingFavorite] = useState<Favorite | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/favorites/${id}`);
      toast.success("Favorite deleted successfully");
      onDelete(id);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setDeletingId((curr) => (curr === id ? null : curr));
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Director</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Budget</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Year/Time</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{fav.title}</td>
                <td className="py-3 px-4 text-gray-700">{fav.type}</td>
                <td className="py-3 px-4 text-gray-700">{fav.director}</td>
                <td className="py-3 px-4 text-gray-700">{fav.budget ? `$${fav.budget} million` : ''}</td>
                <td className="py-3 px-4 text-gray-700">{fav.location}</td>
                <td className="py-3 px-4 text-gray-700">{fav.duration ? `${fav.duration} ${fav.type === 'TV Show' ? 'min/ep' : 'min'}` : ''}</td>
                <td className="py-3 px-4 text-gray-700">{fav.yearOrTime ? String(fav.yearOrTime).slice(0, 10) : ''}</td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button
                    onClick={() => setEditingFavorite(fav)}
                    disabled={deletingId === fav.id}
                    className="text-blue-600 hover:underline disabled:text-blue-300 disabled:no-underline disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    disabled={deletingId === fav.id}
                    className="text-red-600 hover:underline disabled:text-red-300 disabled:no-underline disabled:cursor-not-allowed text-sm font-medium inline-flex items-center"
                  >
                    {deletingId === fav.id ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-1"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {editingFavorite && (
        <EditFavoriteModal
          favorite={editingFavorite}
          onClose={() => setEditingFavorite(null)}
          onSuccess={onEditSuccess}
        />
      )}
    </>
  );
};

export default FavoritesTable;


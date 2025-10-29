import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../services/api";
import type { Favorite } from "../types/favorite";
import FavoritesTable from "../components/FavoritesTable";
import FavoriteForm from "../components/FavoriteForm";

const fetchFavorites = async ({ pageParam = 0 }): Promise<Favorite[]> => {
  console.log(`🔄 Fetching favorites - Page: ${pageParam}, Skip: ${pageParam}, Take: 10`);
  const res = await api.get(`/favorites?skip=${pageParam}&take=10`);
  console.log(`✅ Received ${res.data.length} favorites for page ${pageParam}`);
  return res.data;
};

const Home = () => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 10 ? undefined : allPages.length * 10,
  });

  const favorites = data?.pages.flat() || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          🎬 Favorite Movies & TV Shows
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - Left side on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Add New Favorite
              </h2>
              <FavoriteForm
                onAdd={async () => {
                  await queryClient.invalidateQueries({ queryKey: ["favorites"] });
                }}
              />
            </div>
          </div>

          {/* Table Section - Right side on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Your Favorites ({favorites.length})
              </h2>
            
              <div 
                id="scrollable-table"
                className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg"
              >
                <InfiniteScroll
                  dataLength={favorites.length}
                  next={() => {
                    console.log('🚀 Infinite scroll triggered! Fetching next page...');
                    fetchNextPage();
                  }}
                  hasMore={!!hasNextPage}
                  loader={
                    isFetchingNextPage && (
                      <div className="text-center mt-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading more...</p>
                      </div>
                    )
                  }
                  scrollableTarget="scrollable-table"
                >
                  <FavoritesTable
                    favorites={favorites}
                    onDelete={async () => {
                      await queryClient.invalidateQueries({ queryKey: ["favorites"] });
                    }}
                    onEditSuccess={async () => {
                        await queryClient.invalidateQueries({ queryKey: ["favorites"] });
                      }}

                  />
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

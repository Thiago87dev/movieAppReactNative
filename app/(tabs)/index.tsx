import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCards from "@/components/TrendingCards";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const renderHeader = () => (
    <View>
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <SearchBar
        onPress={() => router.push("/search")}
        placeholder="Search for a movie"
      />
      {trendingMovies && (
        <View className="mt-10">
          <Text className=" text-lg text-white font-bold mb-3">
            Trending Movies
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4" />}
            className="mb-4 mt-3"
            data={trendingMovies}
            renderItem={({ item, index }) => (
              <TrendingCards movie={item} index={index} />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
          />
        </View>
      )}
      <Text className="text-lg text-white font-bold mt-5 mb-3">
        Latest Movies
      </Text>
    </View>
  )

  const renderItem = ({item}:{item:Movie}) => <MovieCard {...item}/>
  const keyExtractor = (item:Movie) => item.id.toString()

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size={"large"}
            color={"#0000ff"}
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error:{moviesError?.message || trendingError?.message}</Text>
        ) : (
              <FlatList<Movie>
                data={movies}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
              />
        )}
    </View>
  );
}

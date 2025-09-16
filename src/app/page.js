export const dynamic = "force-dynamic";


import Results from '@/components/Results';

const API_KEY = process.env.API_KEY;

export default async function Home() {
  // 1) TMDB'den trending movies
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch TMDB data');
  }

  const data = await res.json();
  const trendingResults = data.results;

  // 2) Kendi backend'den homepage content
  let homePageContent = null;

  try {
    const apiRes = await fetch(
      `${process.env.URL}/api/homepagecontent/get`,
      {
        method: 'GET', // body göndermiyorsan GET daha uygun
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // her istekte güncel data
      }
    );

    if (!apiRes.ok) {
      throw new Error('Failed to fetch homepage content');
    }

    const homePageData = await apiRes.json();
    homePageContent = homePageData[0] || null;
  } catch (error) {
    console.error('Error getting the home page content:', error);
  }

  // 3) Render
  return (
    <div>
      {homePageContent && (
        <div className="text-center mb-10 max-w-6xl mx-auto py-10">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {homePageContent.title}
          </h1>
          <div
            className="sm:text-lg p-4"
            dangerouslySetInnerHTML={{ __html: homePageContent.description }}
          />
        </div>
      )}

      <div>
        <Results results={trendingResults} />
      </div>
    </div>
  );
}
